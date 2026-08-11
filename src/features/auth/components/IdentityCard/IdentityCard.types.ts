export interface IdentityCardProps {
  onVerifyPress?: () => void;
  /** When true, shows verified state instead of Verify Now. */
  verified?: boolean;
  /** When true, shows an Optional badge. Defaults to true. */
  optional?: boolean;
}
