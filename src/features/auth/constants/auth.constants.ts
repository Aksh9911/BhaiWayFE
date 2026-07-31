export const AUTH_CONSTANTS = {
  phoneLength: 10,
  otpLength: 4,
  otpResendSeconds: 30,
} as const;

export const AUTH_MOCK_DELAYS = {
  requestOtpMs: 600,
  verifyOtpMs: 800,
  completeProfileMs: 900,
} as const;

export const INVALID_MOCK_OTP = '0000';
