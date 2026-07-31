import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getSearchParam } from '@/shared/utils';
import {
  CURRENT_LOCATION_MAP_DELTA,
  DEFAULT_MAP_COORDINATE,
  DEFAULT_MAP_DELTA,
} from '@/features/ride-search/constants';
import {
  resolvePlaceDetails,
  reverseGeocodeCoordinate,
  searchPlaces,
  fetchNearbyPlaces,
  placesErrorMessage,
  createPlacesSessionToken,
} from '@/features/ride-search/services';
import { getRecentPlaceDetails, recentPlacesStore } from '@/features/ride-search/store';
import type {
  MapRegion,
  PlacesAutocompletePrediction,
  SelectedDestination,
} from '@/features/ride-search/types';
import { regionForPrecisePlace } from '@/features/ride-search/utils';
import { SELECT_COMMUTE_LOCATION_SCREEN } from '../constants';
import { publishCommuteDraft } from '../store';
import type {
  CommuteLocationField,
  CommuteSelectedLocation,
  PublishCommuteDraft,
} from '../types';

const toRegion = (
  latitude: number,
  longitude: number,
  delta: { latitudeDelta: number; longitudeDelta: number } = DEFAULT_MAP_DELTA,
): MapRegion => ({
  latitude,
  longitude,
  ...delta,
});

const isCommuteLocationField = (value: string): value is CommuteLocationField =>
  value === 'start' || value === 'office';

const otherField = (field: CommuteLocationField): CommuteLocationField =>
  field === 'start' ? 'office' : 'start';

/** Nothing pre-selected — map opens at the default coordinate with a blank search. */
const emptySelection = (): CommuteSelectedLocation => ({
  placeName: '',
  address: '',
  latitude: DEFAULT_MAP_COORDINATE.latitude,
  longitude: DEFAULT_MAP_COORDINATE.longitude,
});

const resolveInitialSelection = (
  field: CommuteLocationField,
  draft: PublishCommuteDraft,
): CommuteSelectedLocation => {
  const existing =
    field === 'start' ? draft.startLocationDetail : draft.officeLocationDetail;
  return existing ?? emptySelection();
};

const isFieldFilled = (field: CommuteLocationField, draft: PublishCommuteDraft): boolean =>
  field === 'start'
    ? Boolean(draft.startLocationDetail?.placeName || draft.startLocation.trim())
    : Boolean(draft.officeLocationDetail?.placeName || draft.officeLocation.trim());

export const useSelectCommuteLocation = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ field?: string }>();
  const fieldParam = getSearchParam(params.field);
  const initialField: CommuteLocationField = isCommuteLocationField(fieldParam)
    ? fieldParam
    : 'start';

  // Local active field — switching Leaving from ↔ Drop-off stays on one screen.
  const [field, setField] = useState<CommuteLocationField>(initialField);
  const copy = SELECT_COMMUTE_LOCATION_SCREEN[field];

  const [draft, setDraft] = useState<PublishCommuteDraft>(() => publishCommuteDraft.get());
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [predictions, setPredictions] = useState<PlacesAutocompletePrediction[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlacesAutocompletePrediction[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<PlacesAutocompletePrediction[]>(() =>
    recentPlacesStore.get(),
  );
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<CommuteSelectedLocation>(() =>
    resolveInitialSelection(initialField, publishCommuteDraft.get()),
  );
  const [region, setRegion] = useState<MapRegion>(() => {
    const initial = resolveInitialSelection(initialField, publishCommuteDraft.get());
    return toRegion(initial.latitude, initial.longitude);
  });
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
  const fieldRef = useRef(field);
  fieldRef.current = field;

  useEffect(() => publishCommuteDraft.subscribe(setDraft), []);
  useEffect(() => recentPlacesStore.subscribe(setRecentPlaces), []);

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
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch {
        // Keep default selection if GPS is unavailable.
      }
    };
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadNearbySuggestions = useCallback(async () => {
    const coordinate = userLocation ?? {
      latitude: regionRef.current.latitude,
      longitude: regionRef.current.longitude,
    };
    try {
      const results = await fetchNearbyPlaces(coordinate);
      setNearbyPlaces(results);
    } catch {
      setNearbyPlaces([]);
    }
  }, [userLocation]);

  const activateField = useCallback(
    (nextField: CommuteLocationField, options?: { openSearch?: boolean }) => {
      const openSearchNext = options?.openSearch ?? true;
      const next = resolveInitialSelection(nextField, publishCommuteDraft.get());

      abortRef.current?.abort();
      requestIdRef.current += 1;
      sessionTokenRef.current = createPlacesSessionToken();

      setField(nextField);
      fieldRef.current = nextField;
      skipNextRegionGeocode.current = true;
      setSelected(next);
      setRegion(toRegion(next.latitude, next.longitude));
      setQuery('');
      setPredictions([]);
      setLoading(false);

      if (openSearchNext) {
        setSearchMode(true);
        void loadNearbySuggestions();
      } else {
        setSearchMode(false);
      }
    },
    [loadNearbySuggestions],
  );

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

  // Fresh search results always belong to the active field only.
  useEffect(() => {
    if (!searchMode) {
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 1) {
      abortRef.current?.abort();
      setPredictions([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const activeFieldAtStart = field;
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
          // Drop stale responses if the user switched Leaving from ↔ Drop-off.
          if (requestIdRef.current === requestId && fieldRef.current === activeFieldAtStart) {
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
  }, [query, region.latitude, region.longitude, userLocation, searchMode, field]);

  useEffect(() => {
    if (searchMode) {
      void loadNearbySuggestions();
    }
  }, [searchMode, field, loadNearbySuggestions]);

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
        setSelected((prev) => ({ ...prev, boundary: undefined }));
        void applyCoordinate(next.latitude, next.longitude);
      }
    },
    [applyCoordinate],
  );

  /**
   * Save the chosen place into the active field only, then:
   * - open the other field's search if it is still empty
   * - otherwise close search (both filled)
   */
  const commitFieldSelection = useCallback(
    (destination: SelectedDestination, forField: CommuteLocationField) => {
      Keyboard.dismiss();
      recentPlacesStore.add(destination);
      publishCommuteDraft.setLocation(forField, destination);

      const nextDraft = publishCommuteDraft.get();
      const next = otherField(forField);

      setQuery('');
      setPredictions([]);
      setSelected(destination);
      skipNextRegionGeocode.current = true;
      setRegion(regionForPrecisePlace(destination));

      if (!isFieldFilled(next, nextDraft)) {
        activateField(next, { openSearch: true });
        return;
      }

      setSearchMode(false);
      setField(forField);
      fieldRef.current = forField;
    },
    [activateField],
  );

  const selectPrediction = useCallback(
    async (prediction: PlacesAutocompletePrediction) => {
      if (selecting) {
        return;
      }

      const activeField = fieldRef.current;
      setSelecting(true);
      try {
        if (prediction.placeId.startsWith('recent:')) {
          const cached = getRecentPlaceDetails(prediction.placeId);
          if (cached) {
            commitFieldSelection(cached, activeField);
            return;
          }
        }

        const destination = await resolvePlaceDetails(prediction);
        commitFieldSelection(destination, activeField);
        sessionTokenRef.current = createPlacesSessionToken();
      } catch (error) {
        Alert.alert('Location unavailable', placesErrorMessage(error));
      } finally {
        setSelecting(false);
      }
    },
    [commitFieldSelection, selecting],
  );

  const locateMe = useCallback(async () => {
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
      setRegion(toRegion(next.latitude, next.longitude, CURRENT_LOCATION_MAP_DELTA));

      const destination = await reverseGeocodeCoordinate(next);
      const precise = { ...destination, boundary: undefined };
      setSelected(precise);
      return precise;
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
    const destination = await locateMe();
    if (!destination) {
      return;
    }
    commitFieldSelection(destination, fieldRef.current);
  }, [commitFieldSelection, locateMe]);

  const openField = useCallback(
    (nextField: CommuteLocationField) => {
      if (nextField === field && searchMode) {
        return;
      }
      activateField(nextField, { openSearch: true });
    },
    [activateField, field, searchMode],
  );

  const confirm = useCallback(() => {
    if (!selected.placeName.trim()) {
      Alert.alert(
        'Select a location',
        field === 'start'
          ? 'Please choose a pickup point on the map.'
          : 'Please choose a drop-off point on the map.',
      );
      return;
    }

    const otherAlreadyFilled = isFieldFilled(otherField(field), publishCommuteDraft.get());
    commitFieldSelection(selected, field);

    // Other field already set → both done. Otherwise search opens for the empty field.
    if (otherAlreadyFilled) {
      router.back();
    }
  }, [commitFieldSelection, field, router, selected]);

  const goBack = useCallback(() => {
    if (searchMode) {
      closeSearch();
      return;
    }
    router.back();
  }, [closeSearch, router, searchMode]);

  const isSearching = query.trim().length >= 1;
  const nearbyWithoutRecent = nearbyPlaces.filter(
    (place) =>
      !recentPlaces.some(
        (recent) =>
          recent.placeId === place.placeId ||
          recent.placeName.toLowerCase() === place.placeName.toLowerCase(),
      ),
  );

  const suggestionSections = useMemo(
    () =>
      isSearching
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
          ],
    [isSearching, nearbyWithoutRecent, predictions, recentPlaces],
  );

  const suggestions = suggestionSections.flatMap((section) => section.data);

  return {
    field,
    copy,
    draft,
    query,
    setQuery,
    searchMode,
    openSearch,
    closeSearch,
    openField,
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
    handleRegionChangeComplete,
    selectPrediction,
    locateMe,
    confirm,
    goBack,
  };
};
