import type { SavedPlace } from '../../types';

export interface SavedPlacesRowProps {
  places: readonly SavedPlace[];
  onSelect: (place: SavedPlace) => void;
}
