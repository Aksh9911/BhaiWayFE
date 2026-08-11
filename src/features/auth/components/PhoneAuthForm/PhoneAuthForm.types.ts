import type { AuthFlow } from '../../types';

export interface PhoneAuthFormProps {
  flow: AuthFlow;
  /** When set, shows the top Header with this title. Omit to hide the titled header. */
  title?: string;
  heading: string;
  subtitle: string;
  /** @deprecated Help now opens the FAQ screen; kept for call-site compatibility. */
  helpMessage?: string;
}
