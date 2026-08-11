import {
  MIN_OFFICE_COMMUTE_DISTANCE_KM,
  MIN_OUTSTATION_DISTANCE_KM,
  ROUTE_AVERAGE_SPEED_KMPH,
} from '../constants';
import type { RouteInfo, SelectedLocation } from '../types';

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const haversineDistanceKm = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

export const formatDistanceLabel = (distanceKm: number): string =>
  distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;

export const formatDurationLabel = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.max(1, Math.round(minutes))} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  return remainder > 0 ? `${hours} hr ${remainder} min` : `${hours} hr`;
};

const hasCoordinates = (location: SelectedLocation): boolean =>
  Number.isFinite(location.latitude) &&
  Number.isFinite(location.longitude) &&
  (location.latitude !== 0 || location.longitude !== 0);

export type RouteDistanceKind = 'office' | 'outstation';

export const minDistanceKmForRouteKind = (kind: RouteDistanceKind): number =>
  kind === 'office' ? MIN_OFFICE_COMMUTE_DISTANCE_KM : MIN_OUTSTATION_DISTANCE_KM;

/**
 * Returns an error message when start and destination are closer than the
 * minimum for the ride kind; otherwise null.
 */
export const getRouteTooCloseMessage = (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  kind: RouteDistanceKind,
): string | null => {
  const minKm = minDistanceKmForRouteKind(kind);
  if (minKm <= 0) {
    return null;
  }

  const distanceKm = haversineDistanceKm(origin, destination);
  if (distanceKm >= minKm) {
    return null;
  }

  const current = formatDistanceLabel(distanceKm);
  if (kind === 'office') {
    return `Pickup and drop-off must be at least ${minKm} km apart for office commute (currently ${current}).`;
  }
  return `Origin and destination must be at least ${minKm} km apart for outstation rides (currently ${current}).`;
};

/**
 * Straight-line route estimate between two selected locations. Returns null
 * when either point is missing real coordinates (e.g. text-only entries).
 */
export const buildRouteInfo = (
  origin: SelectedLocation | null,
  destination: SelectedLocation | null,
): RouteInfo | null => {
  if (!origin || !destination || !hasCoordinates(origin) || !hasCoordinates(destination)) {
    return null;
  }

  const distanceKm = haversineDistanceKm(origin, destination);
  if (distanceKm < 0.05) {
    return null;
  }

  const durationMinutes = (distanceKm / ROUTE_AVERAGE_SPEED_KMPH) * 60;

  return {
    distanceKm,
    durationMinutes,
    distanceLabel: formatDistanceLabel(distanceKm),
    durationLabel: formatDurationLabel(durationMinutes),
  };
};

/** Readable 12-hour time, e.g. 6:05 PM */
export const formatTimeLabel = (date: Date): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
};
