import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  findCurrentUserSheetRow,
  useDemoDataViewer,
  type DemoBooking,
  type DemoDataTabId,
  type DemoUser,
  type DemoVehicle,
  type UserDetailsSheetRow,
} from '@/DemoData';
import { canAccessLocalDemoData } from '@/features/profile/constants';
import { AppText as Text } from '@/shared/components';
import { authSession } from '@/store';
import { demoDataTokens, styles } from './DemoDataScreen.styles';

const TABS: { id: DemoDataTabId; label: string }[] = [
  { id: 'sheet', label: 'Sheet' },
  { id: 'users', label: 'Users' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'bookings', label: 'Bookings' },
];

const EMPTY_COPY: Record<DemoDataTabId, { title: string; subtitle: string }> = {
  sheet: {
    title: 'No app-entered sheet rows yet',
    subtitle:
      'Data appears here only after you enter it in the app: profile name, Aadhaar, corporate ID, and vehicle.',
  },
  users: {
    title: 'No users saved yet',
    subtitle: 'Complete profile setup to store a local user.',
  },
  vehicles: {
    title: 'No vehicles saved yet',
    subtitle: 'Add a vehicle from My Garage to store it locally.',
  },
  bookings: {
    title: 'No bookings saved yet',
    subtitle: 'Continue payment on a ride to store a local booking.',
  },
};

const renderSheetRow = (item: UserDetailsSheetRow) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      UserID {item.userId} · {item.userName || 'Unnamed user'}
    </Text>
    <Text style={styles.cardLine}>Email: {item.email || '—'}</Text>
    <Text style={styles.cardLine}>AadharNumber: {item.aadharNumber || '—'}</Text>
    <Text style={styles.cardLine}>CorporateID: {item.corporateId || '—'}</Text>
    <Text style={styles.cardLine}>
      Vehicle: {[item.vehicleColor, item.vehicleModel, item.vehicleType].filter(Boolean).join(' ') || '—'}
    </Text>
    <Text style={styles.cardLine}>VehicleNumberPlate: {item.vehicleNumberPlate || '—'}</Text>
    <Text style={styles.cardLine}>BhaiWayWallet: {item.bhaiWayWallet}</Text>
    <Text style={styles.cardLine}>Mobile: {item.mobile || '—'}</Text>
    <Text style={styles.cardLine} numberOfLines={1}>
      ProfilePicture: {item.profilePicture || '—'}
    </Text>
    <Text style={styles.cardLine} numberOfLines={1}>
      RC: {item.rc || '—'}
    </Text>
    <Text style={styles.cardLine} numberOfLines={1}>
      CorporateID (photo): {item.corporateIdUrl || '—'}
    </Text>
  </View>
);

const renderUser = (item: DemoUser) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      #{item.user_id} · {item.full_name}
    </Text>
    <Text style={styles.cardLine}>{item.email || 'No email'}</Text>
    <Text style={styles.cardLine}>{item.mobile || 'No mobile'}</Text>
    <Text style={styles.cardLine}>
      {item.gender} · {item.role} · {item.is_verified ? 'Verified' : 'Unverified'}
    </Text>
  </View>
);

const renderVehicle = (item: DemoVehicle) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      #{item.vehicle_id} · {item.make} {item.model}
    </Text>
    <Text style={styles.cardLine}>{item.vehicle_number}</Text>
    <Text style={styles.cardLine}>
      {item.vehicle_type} · {item.color} · {item.seats} seats · Owner #{item.owner_id}
    </Text>
  </View>
);

const renderBooking = (item: DemoBooking) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      #{item.booking_id} · Ride #{item.ride_id}
    </Text>
    <Text style={styles.cardLine}>
      Passenger #{item.passenger_id} · {item.seats_booked} seat(s)
    </Text>
    <Text style={styles.cardLine}>
      {item.amount} · {item.booking_status} · {item.payment_status}
    </Text>
    <Text style={styles.cardLine}>{new Date(item.booked_at).toLocaleString()}</Text>
  </View>
);

export const DemoDataScreen = () => {
  const router = useRouter();
  const {
    tab,
    setTab,
    sheetRows,
    users,
    vehicles,
    bookings,
    counts,
    refreshing,
    refresh,
    clearAll,
    copySheetCsv,
    pullFromSheet,
    pushToSheet,
    goBack,
  } = useDemoDataViewer();

  useEffect(() => {
    const phone =
      findCurrentUserSheetRow()?.mobile || authSession.getUser()?.phone || '';
    if (!canAccessLocalDemoData(phone)) {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace('/home');
    }
  }, [router]);

  const data = useMemo(() => {
    if (tab === 'sheet') {
      return sheetRows;
    }
    if (tab === 'vehicles') {
      return vehicles;
    }
    if (tab === 'bookings') {
      return bookings;
    }
    return users;
  }, [bookings, sheetRows, tab, users, vehicles]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { backgroundColor: demoDataTokens.SURFACE_LOW },
          ]}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={demoDataTokens.PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          Local Demo Data
        </Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((entry) => {
          const active = entry.id === tab;
          return (
            <Pressable
              key={entry.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(entry.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{entry.label}</Text>
              <Text style={[styles.tabCount, active && styles.tabCountActive]}>
                {counts[entry.id]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data as Array<UserDetailsSheetRow | DemoUser | DemoVehicle | DemoBooking>}
        keyExtractor={(item) => {
          if ('row_id' in item) {
            return `sheet-${item.row_id}`;
          }
          if ('user_id' in item) {
            return `user-${item.user_id}`;
          }
          if ('vehicle_id' in item) {
            return `vehicle-${item.vehicle_id}`;
          }
          return `booking-${item.booking_id}`;
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={36} color={demoDataTokens.PRIMARY} />
            <Text style={styles.emptyTitle}>{EMPTY_COPY[tab].title}</Text>
            <Text style={styles.emptySubtitle}>{EMPTY_COPY[tab].subtitle}</Text>
          </View>
        }
        renderItem={({ item }) => {
          if ('row_id' in item) {
            return renderSheetRow(item);
          }
          if ('user_id' in item) {
            return renderUser(item);
          }
          if ('vehicle_id' in item) {
            return renderVehicle(item);
          }
          return renderBooking(item);
        }}
      />

      <View style={styles.footerBar}>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.9 }]}
          onPress={() => void pullFromSheet()}
          accessibilityRole="button"
          accessibilityLabel="Pull data from Google Sheet"
        >
          <Text style={styles.secondaryLabel}>Pull</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.9 }]}
          onPress={() => void pushToSheet()}
          accessibilityRole="button"
          accessibilityLabel="Push local rows to Google Sheet"
        >
          <Text style={styles.secondaryLabel}>Push</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.9 }]}
          onPress={copySheetCsv}
          accessibilityRole="button"
          accessibilityLabel="Share sheet CSV"
        >
          <Text style={styles.secondaryLabel}>CSV</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.dangerButton, pressed && { opacity: 0.9 }]}
          onPress={clearAll}
          accessibilityRole="button"
          accessibilityLabel="Clear all local demo data"
        >
          <Text style={styles.dangerLabel}>Clear</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
