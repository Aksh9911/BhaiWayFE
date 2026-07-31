import type { AuthFlow } from '../../types';

export interface PhoneAuthFormProps {
  flow: AuthFlow;
  title: string;
  heading: string;
  subtitle: string;
  helpMessage: string;
}
