import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ROUTES } from '@/config';
import {
  AppFooter,
  Button,
  InfoBanner,
  KeyboardAwareScrollView,
  MissingLocationModal,
  NativeDatePicker,
  ScreenIntro,
} from '@/shared/components';
import { spacing } from '@/shared/theme';
import { getSearchParam } from '@/shared/utils';
import { appModeStore } from '@/store';
import { myRidesSurfaceStore } from '@/features/my-rides/store';
import {
  LocationRouteInput,
  PassengerStepper,
  RecentSearchesSection,
  RideSearchTopBar,
  RoutePreviewCard,
  SearchOptionField,
} from '@/features/ride-search/components';
import { useFindRide } from '@/features/ride-search/hooks';
import type { RideSearchMode } from '@/features/ride-search/types';
import { styles } from './FindRideScreen.styles';

export interface FindRideScreenProps {
  mode?: RideSearchMode;
}

const isRideSearchMode = (value: string): value is RideSearchMode =>
  value === 'outstation' || value === 'office' || value === 'publish';

export const FindRideScreen = ({ mode: modeProp }: FindRideScreenProps) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const paramMode = getSearchParam(params.mode);
  const mode: RideSearchMode =
    modeProp ?? (isRideSearchMode(paramMode) ? paramMode : 'outstation');

  useEffect(() => {
    if (mode === 'office') {
      myRidesSurfaceStore.setOfficeCommute();
    } else {
      myRidesSurfaceStore.setStandard();
    }
    appModeStore.setRiding();
  }, [mode]);

  const {
    config,
    form,
    journeyDateLabel,
    journeyTimeLabel,
    originLabel,
    destinationLabel,
    passengerLimits,
    routeInfo,
    searching,
    toggleSameOrganizationOnly,
    setPassengers,
    setJourneyDate,
    setJourneyTime,
    openLocationPicker,
    swapLocations,
    clearLocation,
    recentSearches,
    applyRecentSearch,
    clearRecentSearches,
    minimumJourneyDate,
    search,
    verifyIdentity,
    missingLocationKind,
    closeMissingLocation,
    resolveMissingLocation,
  } = useFindRide(mode);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const showPassengers = config.showPassengers !== false;
  const showTimePicker = config.showTimePicker === true;
  const isOffice = mode === 'office';

  const handleMenuPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isOffice ? ROUTES.officeCommute : ROUTES.home);
  }, [isOffice, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <RideSearchTopBar onMenuPress={handleMenuPress} />

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} bottomInset={spacing.huge}>
        <Animated.View entering={FadeInDown.duration(350)}>
          <ScreenIntro
            title={config.title}
            subtitle={config.subtitle}
            variant="default"
            align={isOffice ? 'left' : 'center'}
            style={styles.intro}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(80)} style={styles.searchCard}>
          <LocationRouteInput
            origin={originLabel}
            destination={destinationLabel}
            originLabel={config.originLabel}
            destinationLabel={config.destinationLabel}
            originPlaceholder={config.originPlaceholder}
            destinationPlaceholder={config.destinationPlaceholder}
            onOriginPress={() => openLocationPicker('origin')}
            onDestinationPress={() => openLocationPicker('destination')}
            onOriginClear={() => clearLocation('origin')}
            onDestinationClear={() => clearLocation('destination')}
            onSwapPress={isOffice ? undefined : swapLocations}
          />

          {routeInfo && form.origin && form.destination ? (
            <Animated.View entering={FadeInDown.duration(300)}>
              <RoutePreviewCard
                origin={form.origin}
                destination={form.destination}
                routeInfo={routeInfo}
              />
            </Animated.View>
          ) : null}

          <View style={styles.optionsRow}>
            <SearchOptionField
              icon="calendar-outline"
              title="Date"
              value={journeyDateLabel}
              onPress={() => setDatePickerOpen(true)}
              accessibilityLabel="Date"
              isPlaceholder={!form.journeyDate}
              open={datePickerOpen}
            />

            {showTimePicker ? (
              <SearchOptionField
                icon="time-outline"
                title="Time"
                value={journeyTimeLabel}
                onPress={() => setTimePickerOpen(true)}
                accessibilityLabel="Time"
                open={timePickerOpen}
              />
            ) : null}

            {showPassengers ? (
              <PassengerStepper
                value={form.passengers}
                min={passengerLimits.min}
                max={passengerLimits.max}
                onChange={setPassengers}
              />
            ) : null}
          </View>

          {isOffice ? (
            <Pressable
              style={styles.checkboxRow}
              onPress={toggleSameOrganizationOnly}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: form.sameOrganizationOnly }}
              accessibilityLabel="Find rides from same organization only"
            >
              <View
                style={[
                  styles.checkbox,
                  form.sameOrganizationOnly && styles.checkboxChecked,
                ]}
              >
                {form.sameOrganizationOnly ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : null}
              </View>
              <View style={styles.checkboxCopy}>
                <Animated.Text style={styles.checkboxLabel}>
                  Find rides from same organization only
                </Animated.Text>
                <Animated.Text style={styles.checkboxHint}>
                  Show commute options from colleagues in your verified company.
                </Animated.Text>
              </View>
            </Pressable>
          ) : null}

          <Button
            label={config.actionLabel}
            onPress={search}
            variant="primary"
            showArrow={!isOffice}
            loading={searching}
            disabled={searching}
            accessibilityLabel={config.actionLabel}
            style={isOffice ? styles.officeSearchButton : undefined}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(160)}>
          <RecentSearchesSection
            items={recentSearches}
            onSelect={applyRecentSearch}
            variant={config.recentVariant ?? 'list'}
            emptyLabel={config.emptyRecentLabel}
            onClearAll={config.recentVariant === 'cards' ? clearRecentSearches : undefined}
          />
        </Animated.View>

        {config.verifyBanner ? (
          <Animated.View entering={FadeInUp.duration(400).delay(220)}>
            <InfoBanner
              variant="verify"
              title={config.verifyBanner.title}
              description={config.verifyBanner.body}
              actionLabel={config.verifyBanner.actionLabel}
              onActionPress={verifyIdentity}
            />
          </Animated.View>
        ) : null}
      </KeyboardAwareScrollView>

      <NativeDatePicker
        visible={datePickerOpen}
        value={form.journeyDate ?? minimumJourneyDate}
        minimumDate={minimumJourneyDate}
        title="Date"
        onChange={setJourneyDate}
        onClose={() => setDatePickerOpen(false)}
      />

      {showTimePicker ? (
        <NativeDatePicker
          visible={timePickerOpen}
          value={form.journeyTime ?? new Date()}
          mode="time"
          title="Time"
          onChange={setJourneyTime}
          onClose={() => setTimePickerOpen(false)}
        />
      ) : null}

      <MissingLocationModal
        visible={missingLocationKind != null}
        kind={missingLocationKind}
        context={mode === 'publish' ? 'drive' : 'ride'}
        onClose={closeMissingLocation}
        onSelect={resolveMissingLocation}
      />

      <AppFooter />
    </SafeAreaView>
  );
};
