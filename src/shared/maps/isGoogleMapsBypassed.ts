import { env } from '@/config';

/** True when Google Maps SDK / Places should not be used (testing / no key). */
export const isGoogleMapsBypassed = (): boolean => env.bypassGoogleMaps;
