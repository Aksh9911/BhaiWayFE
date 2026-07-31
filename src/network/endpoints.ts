export const ENDPOINTS = {
  auth: {
    requestOtp: '/auth/otp/request',
    verifyOtp: '/auth/otp/verify',
    completeProfile: '/auth/profile',
  },
  home: {
    dashboard: '/home/dashboard',
  },
} as const;
