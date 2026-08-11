import React from 'react';

import { PhoneAuthForm } from '@/features/auth/components';

export const PhoneScreen = () => (
  <PhoneAuthForm
    flow="signup"
    heading="Enter your mobile number"
    subtitle="We will send you a verification code to secure your account."
  />
);
