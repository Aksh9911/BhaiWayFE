import Constants from 'expo-constants';
import {
  DEMO_BANK_ACCOUNTS_SHEET_GID,
  DEMO_CHAT_MESSAGES_SHEET_GID,
  DEMO_CHAT_THREADS_SHEET_GID,
  DEMO_GOOGLE_SHEET_ID,
  DEMO_NOTIFICATIONS_SHEET_GID,
  DEMO_PUBLISHED_RIDES_SHEET_GID,
  DEMO_RIDE_BOOKINGS_SHEET_GID,
  DEMO_VEHICLES_SHEET_GID,
  DEMO_WALLET_TRANSACTIONS_SHEET_GID,
} from '@/DemoData/files';

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface EnvConfig {
  readonly environment: AppEnvironment;
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableLogging: boolean;
  readonly useMocks: boolean;
  /**
   * Alias for demo data architecture (RTK Query → DemoData).
   * Prefer `EXPO_PUBLIC_DEMO_MODE`; falls back to `useMocks`.
   */
  readonly demoMode: boolean;
  /** Real-time transport: demo (in-app bus) | websocket | none */
  readonly realtimeTransport: 'demo' | 'websocket' | 'none';
  readonly realtimeUrl: string;
  /** Real SMS OTP via MSG91 SendOTP widget (custom UI). */
  readonly useMsg91Otp: boolean;
  readonly msg91WidgetId: string;
  readonly msg91AuthToken: string;
  /** Google Sheet used as UserDetails demo source (read via public CSV). */
  readonly googleSheetId: string;
  /** gid of the Vehicles tab (multi-vehicle rows). Default 1. */
  readonly googleSheetVehiclesGid: string;
  /** gid of the Notifications tab. Default 2. */
  readonly googleSheetNotificationsGid: string;
  /** gid of the ChatThreads tab. Default 3. */
  readonly googleSheetChatThreadsGid: string;
  /** gid of the ChatMessages tab. Default 4. */
  readonly googleSheetChatMessagesGid: string;
  /** gid of the WalletTransactions tab. Default 5. */
  readonly googleSheetWalletTransactionsGid: string;
  /** gid of the PublishedRides tab. Default 6. */
  readonly googleSheetPublishedRidesGid: string;
  /** gid of the RideBookings tab. Default 7. */
  readonly googleSheetRideBookingsGid: string;
  /** gid of the BankAccounts tab. Default 8. */
  readonly googleSheetBankAccountsGid: string;
  /** Apps Script Web App URL for insert/update writes. */
  readonly googleSheetWebhookUrl: string;
  readonly googlePlacesApiKey: string;
  readonly googleMapsApiKey: string;
  /**
   * Skip Google Maps SDK tiles + Places API (use OSM/Photon search + map placeholder).
   * Defaults to true when no Maps/Places key is configured.
   */
  readonly bypassGoogleMaps: boolean;
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

const msg91WidgetId = firstNonEmpty(
  process.env.EXPO_PUBLIC_MSG91_WIDGET_ID,
  extra.msg91WidgetId,
);

const msg91AuthToken = firstNonEmpty(
  process.env.EXPO_PUBLIC_MSG91_AUTH_TOKEN,
  extra.msg91AuthToken,
);

const useMsg91OtpExplicit = process.env.EXPO_PUBLIC_USE_MSG91_OTP;
const useMsg91Otp =
  Boolean(msg91WidgetId && msg91AuthToken) &&
  (useMsg91OtpExplicit === undefined
    ? true
    : useMsg91OtpExplicit !== 'false' && useMsg91OtpExplicit !== '0');

const googleSheetId = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_ID,
  extra.googleSheetId,
  DEMO_GOOGLE_SHEET_ID,
);

const googleSheetWebhookUrl = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL,
  extra.googleSheetWebhookUrl,
);

const googleSheetVehiclesGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_VEHICLES_GID,
  extra.googleSheetVehiclesGid,
  DEMO_VEHICLES_SHEET_GID,
);

const googleSheetNotificationsGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_NOTIFICATIONS_GID,
  extra.googleSheetNotificationsGid,
  DEMO_NOTIFICATIONS_SHEET_GID,
);

const googleSheetChatThreadsGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_CHAT_THREADS_GID,
  extra.googleSheetChatThreadsGid,
  DEMO_CHAT_THREADS_SHEET_GID,
);

const googleSheetChatMessagesGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_CHAT_MESSAGES_GID,
  extra.googleSheetChatMessagesGid,
  DEMO_CHAT_MESSAGES_SHEET_GID,
);

const googleSheetWalletTransactionsGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_WALLET_TX_GID,
  extra.googleSheetWalletTransactionsGid,
  DEMO_WALLET_TRANSACTIONS_SHEET_GID,
);

const googleSheetPublishedRidesGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_PUBLISHED_RIDES_GID,
  extra.googleSheetPublishedRidesGid,
  DEMO_PUBLISHED_RIDES_SHEET_GID,
);

const googleSheetRideBookingsGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_RIDE_BOOKINGS_GID,
  extra.googleSheetRideBookingsGid,
  DEMO_RIDE_BOOKINGS_SHEET_GID,
);

const googleSheetBankAccountsGid = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_SHEET_BANK_ACCOUNTS_GID,
  extra.googleSheetBankAccountsGid,
  DEMO_BANK_ACCOUNTS_SHEET_GID,
);

export const env: EnvConfig = {
  environment,
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    extra.apiBaseUrl ??
    'https://api.bhaiway.dev/v1',
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? extra.apiTimeoutMs ?? 15000),
  enableLogging: environment !== 'production',
  // Default ON in development so auth/home work without a live backend.
  // Places search uses Google/OSM independently of this flag when a key is set.
  useMocks: readBoolean(process.env.EXPO_PUBLIC_USE_MOCKS, environment === 'development'),
  demoMode: readBoolean(
    process.env.EXPO_PUBLIC_DEMO_MODE ?? process.env.EXPO_PUBLIC_USE_MOCKS,
    environment === 'development',
  ),
  realtimeTransport: (() => {
    const value = (process.env.EXPO_PUBLIC_REALTIME_TRANSPORT ?? '').trim().toLowerCase();
    if (value === 'websocket' || value === 'none' || value === 'demo') {
      return value;
    }
    return readBoolean(process.env.EXPO_PUBLIC_USE_MOCKS, environment === 'development')
      ? 'demo'
      : 'websocket';
  })(),
  realtimeUrl: firstNonEmpty(process.env.EXPO_PUBLIC_REALTIME_URL),
  useMsg91Otp,
  msg91WidgetId,
  msg91AuthToken,
  googleSheetId,
  googleSheetVehiclesGid,
  googleSheetNotificationsGid,
  googleSheetChatThreadsGid,
  googleSheetChatMessagesGid,
  googleSheetWalletTransactionsGid,
  googleSheetPublishedRidesGid,
  googleSheetRideBookingsGid,
  googleSheetBankAccountsGid,
  googleSheetWebhookUrl,
  googlePlacesApiKey,
  googleMapsApiKey,
  bypassGoogleMaps: readBoolean(
    process.env.EXPO_PUBLIC_BYPASS_GOOGLE_MAPS,
    googleMapsApiKey.trim().length === 0 && googlePlacesApiKey.trim().length === 0,
  ),
  cloudinaryCloudName: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    extra.cloudinaryCloudName,
  ),
  cloudinaryUploadPreset: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    extra.cloudinaryUploadPreset,
  ),
};
