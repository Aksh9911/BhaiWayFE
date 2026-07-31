import React from 'react';

import { PhoneAuthForm } from '@/features/auth/components';

export const PhoneScreen = () => (
  <PhoneAuthForm
    flow="signup"
    title="Phone Number"
    heading="Enter your mobile number"
    subtitle="We will send you a verification code to secure your account."
    helpMessage="Enter your 10-digit mobile number to receive a verification code."
  />
);
