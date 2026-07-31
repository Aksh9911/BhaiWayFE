export interface AvatarPickerProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  error?: string;
}
