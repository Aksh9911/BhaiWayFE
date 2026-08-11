import { useCallback, useEffect, useRef } from 'react';

import { CURRENT_LOCATION_MAP_DELTA } from '../constants';
import type { MapRegion } from '../types';

/** Idle time before auto-zooming to the map pointer during location search. */
export const SEARCH_IDLE_ZOOM_MS = 5000;

/** Move the camera to a coordinate without changing the current zoom level. */
export const panKeepZoom = (
  latitude: number,
  longitude: number,
  current: MapRegion,
): MapRegion => ({
  latitude,
  longitude,
  latitudeDelta: current.latitudeDelta,
  longitudeDelta: current.longitudeDelta,
});

export const zoomToPointerRegion = (
  latitude: number,
  longitude: number,
  delta: { latitudeDelta: number; longitudeDelta: number } = CURRENT_LOCATION_MAP_DELTA,
): MapRegion => ({
  latitude,
  longitude,
  ...delta,
});

/**
 * Delays map zoom-in until the user has been idle for {@link SEARCH_IDLE_ZOOM_MS}.
 * Used while searching start / destination so typing or picking places does not
 * yank the camera; after 5s with no action, zoom to the pin.
 */
export const useSearchIdleZoom = (setRegion: (region: MapRegion) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingZoomRef = useRef<MapRegion | null>(null);

  const clearIdleZoom = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flushZoomNow = useCallback(
    (region: MapRegion) => {
      clearIdleZoom();
      pendingZoomRef.current = null;
      setRegion(region);
    },
    [clearIdleZoom, setRegion],
  );

  const runPendingZoom = useCallback(() => {
    const next = pendingZoomRef.current;
    pendingZoomRef.current = null;
    timerRef.current = null;
    if (next) {
      setRegion(next);
    }
  }, [setRegion]);

  /**
   * Queue a zoom-to-pointer. Resets the 5s idle timer on every call.
   * Does not apply the zoom immediately.
   */
  const scheduleIdleZoom = useCallback(
    (region: MapRegion) => {
      pendingZoomRef.current = region;
      clearIdleZoom();
      timerRef.current = setTimeout(runPendingZoom, SEARCH_IDLE_ZOOM_MS);
    },
    [clearIdleZoom, runPendingZoom],
  );

  /**
   * User interacted while searching — restart the idle clock toward the pointer.
   */
  const bumpSearchActivity = useCallback(
    (pointer: { latitude: number; longitude: number }, preciseZoom?: MapRegion) => {
      pendingZoomRef.current =
        preciseZoom ?? zoomToPointerRegion(pointer.latitude, pointer.longitude);
      clearIdleZoom();
      timerRef.current = setTimeout(runPendingZoom, SEARCH_IDLE_ZOOM_MS);
    },
    [clearIdleZoom, runPendingZoom],
  );

  useEffect(
    () => () => {
      clearIdleZoom();
    },
    [clearIdleZoom],
  );

  return {
    scheduleIdleZoom,
    bumpSearchActivity,
    flushZoomNow,
    clearIdleZoom,
  };
};
