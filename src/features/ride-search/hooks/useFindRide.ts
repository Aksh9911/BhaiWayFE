import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  DEFAULT_PASSENGER_COUNT,
  getRideResultPath,
  getSelectLocationPath,
  RIDE_SEARCH_MODE_CONFIG,
  RIDE_SEARCH_PASSENGER_LIMITS,
  SAVED_PLACES,
} from '../constants';
import { reverseGeocodeCoordinate } from '../services';
import { locationPickerBridge, recentSearchesStore } from '../store';
import type {
  LocationFieldType,
  PassengerCount,
  RecentSearchItem,
  RideSearchFormValues,
  RideSearchMode,
  RouteInfo,
  SavedPlace,
} from '../types';
import {
  buildRouteInfo,
  formatDisplayDate,
  formatTimeLabel,
  getRelativeDateLabel,
  startOfDay,
} from '../utils';

const isPassengerCount = (value: number): value is PassengerCount =>
  value === 1 || value === 2 || value === 3;

const getDefaultJourneyTime = (mode: RideSearchMode): Date => {
  const date = new Date();
  if (mode === 'office') {
    date.setHours(8, 30, 0, 0);
    return date;
  }
  return date;
};

export interface UseFindRideResult {
  config: (typeof RIDE_SEARCH_MODE_CONFIG)[RideSearchMode];
  form: RideSearchFormValues;
  journeyDateLabel: string;
  journeyTimeLabel: string;
  originLabel: string;
  destinationLabel: string;
  passengerLimits: typeof RIDE_SEARCH_PASSENGER_LIMITS;
  routeInfo: RouteInfo | null;
  searching: boolean;
  setPassengers: (value: number) => void;
  setJourneyDate: (date: Date) => void;
  setJourneyTime: (time: Date) => void;
  openLocationPicker: (field: LocationFieldType) => void;
  swapLocations: () => void;
  clearLocation: (field: LocationFieldType) => void;
  recentSearches: readonly RecentSearchItem[];
  applyRecentSearch: (item: RecentSearchItem) => void;
  clearRecentSearches: () => void;
  savedPlaces: readonly SavedPlace[];
  applySavedPlace: (place: SavedPlace) => void;
  minimumJourneyDate: Date;
  search: () => void;
  verifyIdentity: () => void;
}

export const useFindRide = (mode: RideSearchMode): UseFindRideResult => {
  const router = useRouter();
  const config = RIDE_SEARCH_MODE_CONFIG[mode];
  const minimumJourneyDate = useMemo(() => startOfDay(new Date()), []);

  const [form, setForm] = useState<RideSearchFormValues>(() => ({
    origin: null,
    passengers: DEFAULT_PASSENGER_COUNT,
    journeyDate: minimumJourneyDate,
    journeyTime: getDefaultJourneyTime(mode),
    destination: null,
  }));
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() =>
    recentSearchesStore.get(),
  );
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return recentSearchesStore.subscribe(setRecentSearches);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return locationPickerBridge.register(({ field, location }) => {
      setForm((prev) =>
        field === 'origin'
          ? { ...prev, origin: location }
          : { ...prev, destination: location },
      );
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCurrentPlace = async () => {
      try {
        const existing = await Location.getForegroundPermissionsAsync();
        let status = existing.status;

        if (status !== Location.PermissionStatus.GRANTED) {
          const requested = await Location.requestForegroundPermissionsAsync();
          status = requested.status;
        }

        if (status !== Location.PermissionStatus.GRANTED || cancelled) {
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) {
          return;
        }

        const currentPlace = await reverseGeocodeCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        if (cancelled) {
          return;
        }

        setForm((prev) => {
          if (prev.origin) {
            return prev;
          }
          return { ...prev, origin: currentPlace };
        });
      } catch {
        // Keep Leaving from empty if current location is unavailable.
      }
    };

    void loadCurrentPlace();

    return () => {
      cancelled = true;
    };
  }, []);

  const setPassengers = useCallback((value: number) => {
    if (!isPassengerCount(value)) {
      return;
    }
    setForm((prev) => ({ ...prev, passengers: value }));
  }, []);

  const setJourneyDate = useCallback((journeyDate: Date) => {
    setForm((prev) => ({ ...prev, journeyDate: startOfDay(journeyDate) }));
  }, []);

  const setJourneyTime = useCallback((journeyTime: Date) => {
    setForm((prev) => ({ ...prev, journeyTime }));
  }, []);

  const openLocationPicker = useCallback(
    (field: LocationFieldType) => {
      router.push(getSelectLocationPath(field));
    },
    [router],
  );

  const swapLocations = useCallback(() => {
    setForm((prev) => ({ ...prev, origin: prev.destination, destination: prev.origin }));
  }, []);

  const clearLocation = useCallback((field: LocationFieldType) => {
    setForm((prev) =>
      field === 'origin' ? { ...prev, origin: null } : { ...prev, destination: null },
    );
  }, []);

  const applyRecentSearch = useCallback((item: RecentSearchItem) => {
    setForm((prev) => ({
      ...prev,
      origin: item.originLocation ?? {
        placeName: item.origin,
        address: item.origin,
        latitude: 0,
        longitude: 0,
      },
      destination: item.destinationLocation ?? {
        placeName: item.destination,
        address: item.destination,
        latitude: 0,
        longitude: 0,
      },
      journeyDate: startOfDay(new Date()),
    }));
  }, []);

  const clearRecentSearches = useCallback(() => {
    recentSearchesStore.clear();
  }, []);

  const verifyIdentity = useCallback(() => {
    router.push(ROUTES.officeCommuteVerify);
  }, [router]);

  const applySavedPlace = useCallback((place: SavedPlace) => {
    setForm((prev) => ({ ...prev, destination: { ...place.location } }));
  }, []);

  const routeInfo = useMemo(
    () => buildRouteInfo(form.origin, form.destination),
    [form.origin, form.destination],
  );

  const search = useCallback(() => {
    if (searching) {
      return;
    }

    if (!form.origin) {
      Alert.alert('Starting point required', 'Please select a starting point.');
      return;
    }

    if (config.showPassengers !== false && !isPassengerCount(form.passengers)) {
      Alert.alert('Passengers required', 'Please select the number of passengers.');
      return;
    }

    if (!form.journeyDate) {
      Alert.alert('Journey date required', 'Please select a journey date.');
      return;
    }

    if (!form.destination) {
      Alert.alert('Destination required', 'Please select a destination.');
      return;
    }

    const { origin, destination, journeyDate, journeyTime, passengers } = form;
    const dateLabel = formatDisplayDate(journeyDate);
    const timeLabel = journeyTime ? formatTimeLabel(journeyTime) : 'Now';

    setSearching(true);
    searchTimerRef.current = setTimeout(() => {
      setSearching(false);
      recentSearchesStore.add({
        origin,
        destination,
        dateLabel,
      });

      if (mode === 'office') {
        router.push({
          pathname: ROUTES.officeCommuteResult,
          params: {
            origin: origin.placeName,
            destination: destination.placeName,
            dateLabel,
            timeLabel,
            originLat: String(origin.latitude),
            originLng: String(origin.longitude),
            destinationLat: String(destination.latitude),
            destinationLng: String(destination.longitude),
          },
        });
        return;
      }

      router.push(
        getRideResultPath({
          origin: origin.placeName,
          destination: destination.placeName,
          dateLabel,
          passengers,
          originLat: origin.latitude,
          originLng: origin.longitude,
          destinationLat: destination.latitude,
          destinationLng: destination.longitude,
        }),
      );
    }, 700);
  }, [config.showPassengers, form, mode, router, searching]);

  return {
    config,
    form,
    journeyDateLabel: getRelativeDateLabel(form.journeyDate, minimumJourneyDate),
    journeyTimeLabel: form.journeyTime ? formatTimeLabel(form.journeyTime) : 'Now',
    originLabel: form.origin?.placeName ?? '',
    destinationLabel: form.destination?.placeName ?? '',
    passengerLimits: RIDE_SEARCH_PASSENGER_LIMITS,
    routeInfo,
    searching,
    setPassengers,
    setJourneyDate,
    setJourneyTime,
    openLocationPicker,
    swapLocations,
    clearLocation,
    recentSearches,
    applyRecentSearch,
    clearRecentSearches,
    savedPlaces: SAVED_PLACES,
    applySavedPlace,
    minimumJourneyDate,
    search,
    verifyIdentity,
  };
};
