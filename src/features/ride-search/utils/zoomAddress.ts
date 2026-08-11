import type { AddressLevels, SelectedDestination } from '../types';

/** latitudeDelta below this → street / precise address is readable. */
export const ZOOM_PRECISE_MAX_DELTA = 0.018;
/** latitudeDelta below this → area / sector is readable; above → city / district. */
export const ZOOM_AREA_MAX_DELTA = 0.06;

export type ZoomAddressDetail = 'precise' | 'area' | 'city';

export const getZoomAddressDetail = (latitudeDelta: number): ZoomAddressDetail => {
  if (latitudeDelta <= ZOOM_PRECISE_MAX_DELTA) {
    return 'precise';
  }
  if (latitudeDelta <= ZOOM_AREA_MAX_DELTA) {
    return 'area';
  }
  return 'city';
};

/**
 * Pick a place title + subtitle based on how zoomed-in the map is.
 * Close zoom → full street address; far zoom → city / district only.
 */
export const getVisibleAddressForZoom = (
  place: SelectedDestination | null | undefined,
  latitudeDelta: number,
): { name: string; address: string } => {
  if (!place?.placeName && !place?.address) {
    return { name: '', address: '' };
  }

  const levels: AddressLevels = place.addressLevels ?? {};
  const detail = getZoomAddressDetail(latitudeDelta);

  if (detail === 'precise') {
    return {
      name: place.placeName || levels.precise || levels.area || '',
      address: place.address,
    };
  }

  if (detail === 'area') {
    const name = levels.area || levels.precise || place.placeName;
    const address =
      [levels.city, levels.district].filter(Boolean).join(', ') ||
      place.address;
    return { name, address };
  }

  const name = levels.city || levels.district || levels.area || place.placeName;
  const address = levels.district && levels.city && levels.district !== levels.city
    ? levels.district
    : levels.district || levels.city || place.address;

  return { name, address };
};

/**
 * Label for the location search box after "Use current location".
 * Prefers sector + locality (e.g. Shakti Khand 1, Indirapuram) over a broader city only.
 */
export const getNearbyAreaSearchLabel = (place: SelectedDestination): string => {
  const levels: AddressLevels = place.addressLevels ?? {};
  const precise = levels.precise?.trim();
  const area = levels.area?.trim();
  const city = levels.city?.trim();
  const district = levels.district?.trim();

  // Sector / neighbourhood + suburb (Indirapuram) when both are present.
  if (
    precise &&
    area &&
    precise.toLowerCase() !== area.toLowerCase() &&
    !/^\d+$/.test(precise)
  ) {
    return `${precise}, ${area}`;
  }

  if (area && city && area.toLowerCase() !== city.toLowerCase()) {
    return `${area}, ${city}`;
  }
  if (area) {
    return area;
  }
  if (precise && city && precise.toLowerCase() !== city.toLowerCase() && !/^\d+$/.test(precise)) {
    return `${precise}, ${city}`;
  }
  if (city && district && city.toLowerCase() !== district.toLowerCase()) {
    return `${city}, ${district}`;
  }
  if (city) {
    return city;
  }
  if (district) {
    return district;
  }

  // Fall back to a short address snippet (first 2 comma parts).
  const shortAddress = place.address
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
  if (shortAddress) {
    return shortAddress;
  }

  if (precise && !/^\d+$/.test(precise)) {
    return precise;
  }

  if (place.placeName?.trim() && place.placeName !== 'Selected location') {
    return place.placeName.trim();
  }

  return 'Nearby area';
};
