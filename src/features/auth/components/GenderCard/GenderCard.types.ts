import type { Gender } from '../../types';

export interface GenderCardProps {
  label: string;
  value: Gender;
  selected: boolean;
  onSelect: (value: Gender) => void;
  fullWidth?: boolean;
}
