import type { MapCoordinate } from '../types';
import {
  formatDistanceLabel,
  formatDurationLabel,
  haversineDistanceKm,
} from '../utils';

export interface RouteGeometry {
  coordinates: MapCoordinate[];
  distanceKm: number;
  durationMinutes: number;
  distanceLabel: string;
  durationLabel: string;
}

interface OsrmRouteResponse {
  code?: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: {
      coordinates?: Array<[number, number]>;
    };
  }>;
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

const isValidCoordinate = (point: MapCoordinate): boolean =>
  Number.isFinite(point.latitude) &&
  Number.isFinite(point.longitude) &&
  !(point.latitude === 0 && point.longitude === 0);

const buildStraightRoute = (
  origin: MapCoordinate,
  destination: MapCoordinate,
): RouteGeometry => {
  const distanceKm = haversineDistanceKm(origin, destination);
  const durationMinutes = Math.max(1, (distanceKm / 28) * 60);

  return {
    coordinates: [origin, destination],
    distanceKm,
    durationMinutes,
    distanceLabel: formatDistanceLabel(distanceKm),
    durationLabel: formatDurationLabel(durationMinutes),
  };
};

/**
 * Fetches the best on-road driving route between two points (OSRM).
 * Requests alternatives and picks the fastest. Falls back to a straight line
 * if the network request fails.
 */
export const fetchDrivingRoute = async (
  origin: MapCoordinate,
  destination: MapCoordinate,
): Promise<RouteGeometry> => {
  if (!isValidCoordinate(origin) || !isValidCoordinate(destination)) {
    return buildStraightRoute(origin, destination);
  }

  const path = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `${OSRM_BASE_URL}/${path}?overview=full&geometries=geojson&alternatives=true&steps=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return buildStraightRoute(origin, destination);
    }

    const data = (await response.json()) as OsrmRouteResponse;
    const routes = data.routes ?? [];
    if (routes.length === 0) {
      return buildStraightRoute(origin, destination);
    }

    // Best route = shortest travel time (OSRM duration), then distance.
    const route = [...routes].sort((a, b) => {
      if (a.duration !== b.duration) {
        return a.duration - b.duration;
      }
      return a.distance - b.distance;
    })[0];

    const rawCoordinates = route?.geometry?.coordinates;
    if (!route || !rawCoordinates?.length) {
      return buildStraightRoute(origin, destination);
    }

    const coordinates: MapCoordinate[] = rawCoordinates.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    }));

    const distanceKm = route.distance / 1000;
    const durationMinutes = route.duration / 60;

    return {
      coordinates,
      distanceKm,
      durationMinutes,
      distanceLabel: formatDistanceLabel(distanceKm),
      durationLabel: formatDurationLabel(durationMinutes),
    };
  } catch {
    return buildStraightRoute(origin, destination);
  }
};
