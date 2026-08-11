export const ENDPOINTS = {
  auth: {
    requestOtp: '/auth/otp/request',
    verifyOtp: '/auth/otp/verify',
    completeProfile: '/auth/profile',
  },
  home: {
    dashboard: '/home/dashboard',
  },
  media: {
    /** Persist Cloudinary secure_url + public_id after client upload. */
    saveAsset: '/media/assets',
    /** Backend-signed Cloudinary destroy. */
    deleteAsset: '/media/cloudinary/delete',
  },
  vehicles: {
    /** Create / register a vehicle with RC Cloudinary URL. */
    create: '/vehicles',
  },
} as const;
