import Constants from 'expo-constants';

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface EnvConfig {
  readonly environment: AppEnvironment;
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableLogging: boolean;
  readonly useMocks: boolean;
  readonly googlePlacesApiKey: string;
  readonly googleMapsApiKey: string;
  readonly cloudinaryCloudName: string;
  readonly cloudinaryUploadPreset: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
const iosMapsKey = Constants.expoConfig?.ios?.config?.googleMapsApiKey;
const androidMapsKey = Constants.expoConfig?.android?.config?.googleMaps?.apiKey;

const firstNonEmpty = (...values: Array<string | undefined | null>): string => {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }
    // Treat .env.example placeholders as unset.
    if (
      trimmed.startsWith('YOUR_') ||
      trimmed === 'changeme' ||
      trimmed === 'REPLACE_ME'
    ) {
      continue;
    }
    return trimmed;
  }
  return '';
};

const resolveEnvironment = (): AppEnvironment => {
  const value = process.env.EXPO_PUBLIC_APP_ENV ?? extra.appEnv;
  if (value === 'production' || value === 'staging') {
    return value;
  }
  return 'development';
};

const environment = resolveEnvironment();

const readBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value !== 'false' && value !== '0';
};

/**
 * Maps SDK keys and Places keys often share one Google Cloud key.
 * Accept either env var / app.json slot so Places search actually runs.
 */
const googleMapsApiKey = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
  extra.googleMapsApiKey,
  extra.googlePlacesApiKey,
  iosMapsKey,
  androidMapsKey,
);

const googlePlacesApiKey = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  extra.googlePlacesApiKey,
  extra.googleMapsApiKey,
  iosMapsKey,
  androidMapsKey,
);

export const env: EnvConfig = {
  environment,
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'https://api.bhaiway.dev/v1',
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? extra.apiTimeoutMs ?? 15000),
  enableLogging: environment !== 'production',
  // Default ON in development so auth/home work without a live backend.
  // Places search uses Google/OSM independently of this flag when a key is set.
  useMocks: readBoolean(process.env.EXPO_PUBLIC_USE_MOCKS, environment === 'development'),
  googlePlacesApiKey,
  googleMapsApiKey,
  cloudinaryCloudName: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    extra.cloudinaryCloudName,
  ),
  cloudinaryUploadPreset: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    extra.cloudinaryUploadPreset,
  ),
};
