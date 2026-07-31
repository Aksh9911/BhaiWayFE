import React from 'react';

import { PhoneAuthForm } from '@/features/auth/components';

export const LoginScreen = () => (
  <PhoneAuthForm
    flow="login"
    title="Login to Account"
    heading="Welcome back"
    subtitle="Enter your mobile number to sign in to your account."
    helpMessage="Enter the mobile number linked to your BhaiWay account."
  />
);
