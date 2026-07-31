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
      name: levels.precise || levels.area || place.placeName,
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
