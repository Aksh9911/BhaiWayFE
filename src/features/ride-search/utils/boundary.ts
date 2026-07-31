import type { MapCoordinate, PlaceViewport, SelectedDestination } from '../types';

/** Build a closed rectangle polygon from a northeast/southwest viewport. */
export const viewportToBoundary = (viewport: PlaceViewport): MapCoordinate[] => {
  const { northeast, southwest } = viewport;
  return [
    { latitude: northeast.latitude, longitude: southwest.longitude },
    { latitude: northeast.latitude, longitude: northeast.longitude },
    { latitude: southwest.latitude, longitude: northeast.longitude },
    { latitude: southwest.latitude, longitude: southwest.longitude },
  ];
};

/** Nominatim boundingbox is [minLat, maxLat, minLon, maxLon] as strings. */
export const nominatimBoundingBoxToBoundary = (
  boundingbox: [string, string, string, string] | string[],
): MapCoordinate[] | undefined => {
  if (boundingbox.length < 4) {
    return undefined;
  }

  const minLat = Number(boundingbox[0]);
  const maxLat = Number(boundingbox[1]);
  const minLon = Number(boundingbox[2]);
  const maxLon = Number(boundingbox[3]);

  if (![minLat, maxLat, minLon, maxLon].every(Number.isFinite)) {
    return undefined;
  }

  return viewportToBoundary({
    northeast: { latitude: maxLat, longitude: maxLon },
    southwest: { latitude: minLat, longitude: minLon },
  });
};

type GeoJsonGeometry =
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }
  | { type: string; coordinates?: unknown };

/** Convert a GeoJSON polygon / multipolygon into map coordinates (outer ring). */
export const geojsonToBoundary = (
  geojson: GeoJsonGeometry | null | undefined,
): MapCoordinate[] | undefined => {
  if (!geojson?.coordinates) {
    return undefined;
  }

  let ring: number[][] | undefined;

  if (geojson.type === 'Polygon') {
    ring = (geojson.coordinates as number[][][])[0];
  } else if (geojson.type === 'MultiPolygon') {
    const polygons = geojson.coordinates as number[][][][];
    ring = polygons
      .map((polygon) => polygon[0])
      .filter((candidate): candidate is number[][] => Array.isArray(candidate) && candidate.length >= 3)
      .sort((a, b) => b.length - a.length)[0];
  }

  if (!ring || ring.length < 3) {
    return undefined;
  }

  const boundary = ring
    .map(([longitude, latitude]) => ({ latitude, longitude }))
    .filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude));

  return boundary.length >= 3 ? boundary : undefined;
};

export const regionFromBoundary = (
  boundary: MapCoordinate[],
  paddingFactor = 1.35,
): { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null => {
  if (boundary.length === 0) {
    return null;
  }

  let minLat = boundary[0].latitude;
  let maxLat = boundary[0].latitude;
  let minLon = boundary[0].longitude;
  let maxLon = boundary[0].longitude;

  boundary.forEach((point) => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLon = Math.min(minLon, point.longitude);
    maxLon = Math.max(maxLon, point.longitude);
  });

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLon + maxLon) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * paddingFactor, 0.008);
  const longitudeDelta = Math.max((maxLon - minLon) * paddingFactor, 0.008);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};

/** Zoom to a place boundary when available; otherwise a tight street-level zoom. */
export const regionForPrecisePlace = (
  place: Pick<SelectedDestination, 'latitude' | 'longitude' | 'boundary'>,
): { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } => {
  if (place.boundary && place.boundary.length >= 3) {
    return (
      regionFromBoundary(place.boundary) ?? {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }
    );
  }

  return {
    latitude: place.latitude,
    longitude: place.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };
};
