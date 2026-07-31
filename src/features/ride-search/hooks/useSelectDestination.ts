import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getSearchParam } from '@/shared/utils';
import {
  CURRENT_LOCATION_MAP_DELTA,
  DEFAULT_MAP_COORDINATE,
  DEFAULT_MAP_DELTA,
  getLocationPickerCopy,
} from '../constants';
import {
  resolvePlaceDetails,
  reverseGeocodeCoordinate,
  searchPlaces,
  fetchNearbyPlaces,
  placesErrorMessage,
  createPlacesSessionToken,
} from '../services';
import { getRecentPlaceDetails, locationPickerBridge, recentPlacesStore } from '../store';
import type {
  LocationFieldType,
  MapRegion,
  PlacesAutocompletePrediction,
  SelectedDestination,
} from '../types';
import { regionForPrecisePlace } from '../utils';

const toRegion = (
  latitude: number,
  longitude: number,
  delta: { latitudeDelta: number; longitudeDelta: number } = DEFAULT_MAP_DELTA,
): MapRegion => ({
  latitude,
  longitude,
  ...delta,
});

const isLocationField = (value: string): value is LocationFieldType =>
  value === 'origin' || value === 'destination';

export const useSelectDestination = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ field?: string }>();
  const fieldParam = getSearchParam(params.field);
  const field: LocationFieldType = isLocationField(fieldParam) ? fieldParam : 'destination';
  const copy = getLocationPickerCopy(field);
  const [query, setQuery] = useState('');
  // Uber-style: tapping From/To opens search immediately.
  const [searchMode, setSearchMode] = useState(true);
  const [predictions, setPredictions] = useState<PlacesAutocompletePrediction[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlacesAutocompletePrediction[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<PlacesAutocompletePrediction[]>(() =>
    recentPlacesStore.get(),
  );
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [region, setRegion] = useState<MapRegion>(
    toRegion(DEFAULT_MAP_COORDINATE.latitude, DEFAULT_MAP_COORDINATE.longitude),
  );
  const [selected, setSelected] = useState<SelectedDestination>({
    placeName: '',
    address: '',
    latitude: DEFAULT_MAP_COORDINATE.latitude,
    longitude: DEFAULT_MAP_COORDINATE.longitude,
  });
  // Only filled when the user picks a place from search — keeps the map
  // search box blank for GPS / map-drag reverse-geocode updates.
  const [searchedPlaceName, setSearchedPlaceName] = useState('');
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const requestIdRef = useRef(0);
  const geocodeIdRef = useRef(0);
  const skipNextRegionGeocode = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const sessionTokenRef = useRef(createPlacesSessionToken());
  const regionRef = useRef(region);
  regionRef.current = region;

  useEffect(() => recentPlacesStore.subscribe(setRecentPlaces), []);

  const applyCoordinate = useCallback(async (latitude: number, longitude: number) => {
    const geocodeId = ++geocodeIdRef.current;
    setGeocoding(true);
    try {
      const destination = await reverseGeocodeCoordinate({ latitude, longitude });
      if (geocodeIdRef.current === geocodeId) {
        setSelected(destination);
      }
    } finally {
      if (geocodeIdRef.current === geocodeId) {
        setGeocoding(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
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

        const next = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserLocation(next);
        skipNextRegionGeocode.current = true;
        setRegion(toRegion(next.latitude, next.longitude));
        // Center the map on GPS, but do not fill the search box — that stays
        // blank until the user searches for a place.
        await applyCoordinate(next.latitude, next.longitude);
      } catch {
        // Keep selection blank if GPS is unavailable.
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [applyCoordinate]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      abortRef.current?.abort();
      setPredictions([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const results = await searchPlaces(
            trimmed,
            userLocation ?? {
              latitude: region.latitude,
              longitude: region.longitude,
            },
            {
              signal: controller.signal,
              sessionToken: sessionTokenRef.current,
            },
          );
          if (requestIdRef.current === requestId) {
            setPredictions(results);
          }
        } catch (error) {
          if (controller.signal.aborted || requestIdRef.current !== requestId) {
            return;
          }
          setPredictions([]);
          Alert.alert('Search failed', placesErrorMessage(error));
        } finally {
          if (requestIdRef.current === requestId) {
            setLoading(false);
          }
        }
      })();
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, region.latitude, region.longitude, userLocation]);

  const loadNearbySuggestions = useCallback(async () => {
    const coordinate = userLocation ?? {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    try {
      const results = await fetchNearbyPlaces(coordinate);
      setNearbyPlaces(results);
    } catch {
      setNearbyPlaces([]);
    }
  }, [region.latitude, region.longitude, userLocation]);

  useEffect(() => {
    if (searchMode) {
      void loadNearbySuggestions();
    }
  }, [searchMode, loadNearbySuggestions]);

  const handleRegionChangeComplete = useCallback(
    (next: MapRegion) => {
      const moved =
        Math.abs(regionRef.current.latitude - next.latitude) > 0.0002 ||
        Math.abs(regionRef.current.longitude - next.longitude) > 0.0002;

      setRegion(next);

      if (skipNextRegionGeocode.current) {
        skipNextRegionGeocode.current = false;
        return;
      }

      if (moved) {
        // Dragging updates the pin / confirm panel only — clear search-box text.
        setSearchedPlaceName('');
        setSelected((prev) => ({ ...prev, boundary: undefined }));
        void applyCoordinate(next.latitude, next.longitude);
      }
    },
    [applyCoordinate],
  );

  const applySelectedPlace = useCallback((destination: SelectedDestination) => {
    Keyboard.dismiss();
    setQuery('');
    setPredictions([]);
    setSearchMode(false);
    setSelected(destination);
    setSearchedPlaceName(destination.placeName);
    skipNextRegionGeocode.current = true;
    setRegion(regionForPrecisePlace(destination));
    recentPlacesStore.add(destination);
    sessionTokenRef.current = createPlacesSessionToken();
  }, []);

  const selectPrediction = useCallback(
    async (prediction: PlacesAutocompletePrediction) => {
      if (selecting) {
        return;
      }

      setSelecting(true);
      try {
        if (prediction.placeId.startsWith('recent:')) {
          const cached = getRecentPlaceDetails(prediction.placeId);
          if (cached) {
            applySelectedPlace(cached);
            return;
          }
        }

        const destination = await resolvePlaceDetails(prediction);
        applySelectedPlace(destination);
      } catch (error) {
        Alert.alert('Location unavailable', placesErrorMessage(error));
      } finally {
        setSelecting(false);
      }
    },
    [applySelectedPlace, selecting],
  );

  const locateMe = useCallback(async (options?: { showInSearchBox?: boolean }) => {
    try {
      const existing = await Location.getForegroundPermissionsAsync();
      let status = existing.status;

      if (status !== Location.PermissionStatus.GRANTED) {
        const requested = await Location.requestForegroundPermissionsAsync();
        status = requested.status;
      }

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          'Location permission needed',
          'Please allow location access to center the map on your position.',
        );
        return null;
      }

      setGeocoding(true);

      // Prefer a fresh high-accuracy fix for the locate button.
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        mayShowUserSettingsDialog: true,
      });
      const next = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setUserLocation(next);
      skipNextRegionGeocode.current = true;
      // Zoom in tightly so the street-level current location is clear.
      setRegion(toRegion(next.latitude, next.longitude, CURRENT_LOCATION_MAP_DELTA));

      const destination = await reverseGeocodeCoordinate(next);
      // Point location — clear any previous area boundary outline.
      const preciseLocation = { ...destination, boundary: undefined };
      setSelected(preciseLocation);

      if (options?.showInSearchBox) {
        setSearchedPlaceName(preciseLocation.placeName || 'Current location');
      }

      return preciseLocation;
    } catch {
      Alert.alert('Location unavailable', 'Unable to fetch your current location.');
      return null;
    } finally {
      setGeocoding(false);
    }
  }, []);

  const openSearch = useCallback(() => {
    setQuery('');
    setPredictions([]);
    sessionTokenRef.current = createPlacesSessionToken();
    setSearchMode(true);
    void loadNearbySuggestions();
  }, [loadNearbySuggestions]);

  const closeSearch = useCallback(() => {
    Keyboard.dismiss();
    setSearchMode(false);
    setQuery('');
    setPredictions([]);
  }, []);

  const pickCurrentLocation = useCallback(async () => {
    Keyboard.dismiss();
    setSearchMode(false);
    setQuery('');
    setPredictions([]);
    await locateMe({ showInSearchBox: true });
  }, [locateMe]);

  const confirm = useCallback(() => {
    if (!selected.placeName.trim()) {
      Alert.alert(
        'Select a location',
        field === 'origin'
          ? 'Please choose a starting point on the map.'
          : 'Please choose a destination on the map.',
      );
      return;
    }

    recentPlacesStore.add(selected);
    locationPickerBridge.publish(field, selected);
    router.back();
  }, [field, router, selected]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const isSearching = query.trim().length >= 1;
  const nearbyWithoutRecent = nearbyPlaces.filter(
    (place) =>
      !recentPlaces.some(
        (recent) =>
          recent.placeId === place.placeId ||
          recent.placeName.toLowerCase() === place.placeName.toLowerCase(),
      ),
  );

  const suggestionSections = isSearching
    ? [
        {
          title: 'Suggestions',
          data: predictions,
          icon: 'search' as const,
        },
      ]
    : [
        ...(recentPlaces.length > 0
          ? [
              {
                title: 'Recent',
                data: recentPlaces,
                icon: 'time-outline' as const,
              },
            ]
          : []),
        ...(nearbyWithoutRecent.length > 0
          ? [
              {
                title: 'Nearby',
                data: nearbyWithoutRecent,
                icon: 'navigate-outline' as const,
              },
            ]
          : []),
      ];

  const suggestions = suggestionSections.flatMap((section) => section.data);

  return {
    field,
    copy,
    query,
    setQuery,
    searchMode,
    openSearch,
    closeSearch,
    pickCurrentLocation,
    suggestions,
    suggestionSections,
    showingRecent: !isSearching,
    isSearching,
    loading,
    geocoding,
    selecting,
    region,
    selected,
    searchedPlaceName,
    handleRegionChangeComplete,
    selectPrediction,
    locateMe,
    confirm,
    goBack,
  };
};
