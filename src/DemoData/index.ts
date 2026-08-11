/**
 * Local DemoData — persists user-entered data on device (AsyncStorage).
 * Shared constants / CSV templates: `src/DemoData/files`.
 */

export {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_VEHICLES_SHEET_GID,
  DEMO_NOTIFICATIONS_SHEET_GID,
  DEMO_CHAT_THREADS_SHEET_GID,
  DEMO_CHAT_MESSAGES_SHEET_GID,
  DEMO_WALLET_TRANSACTIONS_SHEET_GID,
  DEMO_PUBLISHED_RIDES_SHEET_GID,
  DEMO_RIDE_BOOKINGS_SHEET_GID,
  DEMO_BANK_ACCOUNTS_SHEET_GID,
  DEMO_USER_DETAILS_TAB_NAME,
  DEMO_VEHICLES_TAB_NAME,
  DEMO_NOTIFICATIONS_TAB_NAME,
  DEMO_CHAT_THREADS_TAB_NAME,
  DEMO_CHAT_MESSAGES_TAB_NAME,
  DEMO_WALLET_TRANSACTIONS_TAB_NAME,
  DEMO_PUBLISHED_RIDES_TAB_NAME,
  DEMO_RIDE_BOOKINGS_TAB_NAME,
  DEMO_BANK_ACCOUNTS_TAB_NAME,
  DEMO_STORAGE_KEYS,
  DEMO_USER_ROLES,
  DEMO_SHEET_LINKS,
} from './files';

export type {
  DemoUser,
  DemoUserGender,
  DemoUserRole,
  DemoUserInput,
  DemoVehicle,
  DemoVehicleType,
  DemoVehicleInput,
  DemoBooking,
  DemoBookingStatus,
  DemoPaymentStatus,
  DemoBookingInput,
} from './types';

export type {
  UserDetailsSheetRow,
  UserDetailsSheetPatch,
  UserDetailsSheetHeader,
  UserDetailsSheetRole,
} from './userDetailsSheet.types';
export {
  USER_DETAILS_USER_ID_START,
  USER_DETAILS_SHEET_HEADERS,
  userDetailsSheetHeaderCsv,
  normalizeSheetRole,
} from './userDetailsSheet.types';
export type { VehiclesSheetRow, VehiclesSheetPatch, VehiclesSheetHeader } from './vehiclesSheet.types';
export {
  VEHICLES_SHEET_VEHICLE_ID_START,
  VEHICLES_SHEET_HEADERS,
  vehiclesSheetHeaderCsv,
} from './vehiclesSheet.types';
export type {
  NotificationsSheetRow,
  NotificationsSheetPatch,
  NotificationsSheetHeader,
} from './notificationsSheet.types';
export {
  NOTIFICATIONS_SHEET_ID_START,
  NOTIFICATIONS_SHEET_HEADERS,
  notificationsSheetHeaderCsv,
} from './notificationsSheet.types';
export type {
  ChatThreadsSheetRow,
  ChatThreadsSheetPatch,
  ChatMessagesSheetRow,
  ChatMessagesSheetPatch,
  ChatThreadsSheetHeader,
  ChatMessagesSheetHeader,
} from './chatSheet.types';
export {
  CHAT_THREADS_SHEET_ID_START,
  CHAT_MESSAGES_SHEET_ID_START,
  CHAT_THREADS_SHEET_HEADERS,
  CHAT_MESSAGES_SHEET_HEADERS,
  SUPPORT_CHAT_THREAD_KEY,
  chatThreadsSheetHeaderCsv,
  chatMessagesSheetHeaderCsv,
} from './chatSheet.types';
export type {
  WalletTransactionsSheetRow,
  WalletTransactionsSheetPatch,
  WalletTransactionsSheetHeader,
} from './walletTransactionsSheet.types';
export {
  WALLET_TRANSACTIONS_SHEET_ID_START,
  WALLET_TRANSACTIONS_SHEET_HEADERS,
  walletTransactionsSheetHeaderCsv,
} from './walletTransactionsSheet.types';
export type {
  PublishedRidesSheetRow,
  PublishedRidesSheetPatch,
  PublishedRidesSheetHeader,
  PublishedRideSheetStatus,
  PublishedRideSheetType,
} from './publishedRidesSheet.types';
export {
  PUBLISHED_RIDES_SHEET_ID_START,
  PUBLISHED_RIDES_SHEET_HEADERS,
  publishedRidesSheetHeaderCsv,
} from './publishedRidesSheet.types';
export type {
  RideBookingsSheetRow,
  RideBookingsSheetPatch,
  RideBookingsSheetHeader,
  RideBookingSheetStatus,
  RideBookingSheetPaymentStatus,
} from './rideBookingsSheet.types';
export {
  RIDE_BOOKINGS_SHEET_ID_START,
  RIDE_BOOKINGS_SHEET_HEADERS,
  rideBookingsSheetHeaderCsv,
} from './rideBookingsSheet.types';
export type {
  BankAccountsSheetRow,
  BankAccountsSheetPatch,
  BankAccountsSheetHeader,
  BankAccountSheetStatus,
} from './bankAccountsSheet.types';
export {
  BANK_ACCOUNTS_SHEET_ID_START,
  BANK_ACCOUNTS_SHEET_HEADERS,
  bankAccountsSheetHeaderCsv,
} from './bankAccountsSheet.types';
export type {
  RemoteUserDetailsRow,
  SheetValidationInput,
  SheetValidationResult,
  SheetSyncResult,
  RemoteVehicleRow,
  VehicleSyncInput,
  VehicleSyncResult,
  RemoteNotificationRow,
  NotificationSyncResult,
  RemoteChatThreadRow,
  RemoteChatMessageRow,
  ChatSyncResult,
  RemoteWalletTransactionRow,
  WalletTransactionSyncInput,
  WalletTransactionSyncResult,
  RemotePublishedRideRow,
  PublishedRideSyncInput,
  PublishedRideSyncResult,
  RemoteRideBookingRow,
  RideBookingSyncInput,
  RideBookingSyncResult,
  RemoteBankAccountRow,
  BankAccountSyncInput,
  BankAccountSyncResult,
} from './sheet';

export { demoUsersStore } from './usersStore';
export { demoVehiclesStore, formatDemoVehicleLabel, formatDemoVehiclePlate } from './vehiclesStore';
export { demoBookingsStore } from './bookingsStore';
export { userDetailsSheetStore } from './userDetailsSheetStore';
export { vehiclesSheetStore } from './vehiclesSheetStore';
export { notificationsSheetStore } from './notificationsSheetStore';
export { chatThreadsSheetStore } from './chatThreadsSheetStore';
export { chatMessagesSheetStore } from './chatMessagesSheetStore';
export { walletTransactionsSheetStore } from './walletTransactionsSheetStore';
export { publishedRidesSheetStore } from './publishedRidesSheetStore';
export { rideBookingsSheetStore } from './rideBookingsSheetStore';
export { bankAccountsSheetStore } from './bankAccountsSheetStore';
export {
  userDetailsSheetSync,
  vehiclesSheetSync,
  notificationsSheetSync,
  chatSheetSync,
  walletTransactionsSheetSync,
  formatWalletTransactionDateLabel,
  formatWalletTransactionAmountLabel,
  publishedRidesSheetSync,
  rideBookingsSheetSync,
  bankAccountsSheetSync,
  USER_DETAILS_SHEET_APPS_SCRIPT,
} from './sheet';
export {
  findCurrentUserSheetRow,
  findSheetUserByMobile,
  assertSheetUserForLogin,
  getBhaiWayWalletBalance,
  formatBhaiWayWalletLabel,
  subscribeBhaiWayWallet,
  updateBhaiWayWalletBalance,
  recordWalletTransaction,
  applySheetProfileToSession,
  hydrateSessionFromSheet,
  shareUserDetailsSheetCsv,
  shareVehiclesSheetCsv,
  pushAllLocalRowsToSheet,
} from './walletFromSheet';
export {
  findDemoUserForSession,
  mapGenderToDemo,
  mapVehicleCategoryToDemo,
  parseRideIdToNumber,
  resolveDemoOwnerId,
  splitVehicleModel,
} from './mappers';
export { useDemoDataViewer } from './useDemoDataViewer';
export type { DemoDataTabId, UseDemoDataViewerResult } from './useDemoDataViewer';

import { demoUsersStore } from './usersStore';
import { demoVehiclesStore } from './vehiclesStore';
import { demoBookingsStore } from './bookingsStore';
import { userDetailsSheetStore } from './userDetailsSheetStore';
import { vehiclesSheetStore } from './vehiclesSheetStore';
import { notificationsSheetStore } from './notificationsSheetStore';
import { chatThreadsSheetStore } from './chatThreadsSheetStore';
import { chatMessagesSheetStore } from './chatMessagesSheetStore';
import { walletTransactionsSheetStore } from './walletTransactionsSheetStore';
import { publishedRidesSheetStore } from './publishedRidesSheetStore';
import { rideBookingsSheetStore } from './rideBookingsSheetStore';
import { bankAccountsSheetStore } from './bankAccountsSheetStore';
import {
  userDetailsSheetSync,
  vehiclesSheetSync,
  notificationsSheetSync,
  chatSheetSync,
  walletTransactionsSheetSync,
  publishedRidesSheetSync,
  rideBookingsSheetSync,
  bankAccountsSheetSync,
} from './sheet';
import { applySheetProfileToSession } from './walletFromSheet';

/** Load all DemoData collections from device storage (+ pull Google Sheet). */
export const hydrateDemoData = async () => {
  await Promise.all([
    demoUsersStore.hydrate(),
    demoVehiclesStore.hydrate(),
    demoBookingsStore.hydrate(),
    userDetailsSheetStore.hydrate(),
    vehiclesSheetStore.hydrate(),
    notificationsSheetStore.hydrate(),
    chatThreadsSheetStore.hydrate(),
    chatMessagesSheetStore.hydrate(),
    walletTransactionsSheetStore.hydrate(),
    publishedRidesSheetStore.hydrate(),
    rideBookingsSheetStore.hydrate(),
    bankAccountsSheetStore.hydrate(),
  ]);

  try {
    await userDetailsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] sheet pull skipped', error);
  }

  try {
    await vehiclesSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] vehicles sheet pull skipped', error);
  }

  try {
    await notificationsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] notifications sheet pull skipped', error);
  }

  try {
    await chatSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] chat sheet pull skipped', error);
  }

  try {
    await walletTransactionsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] wallet transactions sheet pull skipped', error);
  }

  try {
    await publishedRidesSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] published rides sheet pull skipped', error);
  }

  try {
    await rideBookingsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] ride bookings sheet pull skipped', error);
  }

  try {
    await bankAccountsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[DemoData] bank accounts sheet pull skipped', error);
  }

  applySheetProfileToSession();
};

/** Wipe all locally stored DemoData. */
export const clearDemoData = async () => {
  await Promise.all([
    demoUsersStore.clear(),
    demoVehiclesStore.clear(),
    demoBookingsStore.clear(),
    userDetailsSheetStore.clear(),
    vehiclesSheetStore.clear(),
    notificationsSheetStore.clear(),
    chatThreadsSheetStore.clear(),
    chatMessagesSheetStore.clear(),
    walletTransactionsSheetStore.clear(),
    publishedRidesSheetStore.clear(),
    rideBookingsSheetStore.clear(),
    bankAccountsSheetStore.clear(),
  ]);
};
