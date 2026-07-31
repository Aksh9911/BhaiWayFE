import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES } from '@/config';
import {
  AppFooter,
  BrandTopBar,
  Button,
  IconButton,
  NativeDatePicker,
  ScreenIntro,
} from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import {
  CheckboxRow,
  FormSectionCard,
  PublishRouteFields,
  SeatStepper,
} from '@/features/offer-ride/components';
import { PUBLISH_RIDE_SCREEN } from '@/features/offer-ride/constants';
import { usePublishRide } from '@/features/offer-ride/hooks';
import { styles } from './PublishRideScreen.styles';

export const PublishRideScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    draft,
    updateDraft,
    openLocationPicker,
    openDatePicker,
    closeDatePicker,
    datePickerOpen,
    selectedDate,
    minimumDate,
    selectDate,
    pickTime,
    submit,
    isValid,
  } = usePublishRide();

  const rideTypeTitle = draft.rideType === 'assured' ? 'Assured Ride' : 'Regular Ride';

  const handleMenuPress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandTopBar
        onMenuPress={handleMenuPress}
        right={
          <IconButton
            icon="notifications-outline"
            onPress={() => router.push(ROUTES.notifications)}
            accessibilityLabel="Notifications"
          />
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenIntro
          title={rideTypeTitle}
          subtitle={PUBLISH_RIDE_SCREEN.intro.subtitle}
          variant="default"
          style={styles.intro}
        />

        <FormSectionCard title="Route Details" icon="git-branch-outline">
          <PublishRouteFields
            origin={draft.origin}
            destination={draft.destination}
            onOriginPress={() => openLocationPicker('origin')}
            onDestinationPress={() => openLocationPicker('destination')}
          />
        </FormSectionCard>

        <FormSectionCard title="Date & Time" icon="calendar-outline">
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Pressable
                onPress={openDatePicker}
                style={[styles.pressableField, datePickerOpen && styles.pressableFieldActive]}
                accessibilityRole="button"
              >
                <Text style={[styles.fieldLabel, datePickerOpen && styles.fieldLabelActive]}>
                  Departure Date
                </Text>
                <View style={styles.fieldIconRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                  <Text style={[styles.fieldValue, !draft.departureDate && styles.fieldPlaceholder]}>
                    {draft.departureDate || 'dd/mm/yyyy'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.primary} />
                </View>
              </Pressable>
            </View>

            <View style={styles.fieldHalf}>
              <Pressable onPress={pickTime} style={styles.pressableField} accessibilityRole="button">
                <Text style={styles.fieldLabel}>Departure Time</Text>
                <View style={styles.fieldIconRow}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={[styles.fieldValue, !draft.departureTime && styles.fieldPlaceholder]}>
                    {draft.departureTime || '--:-- --'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.primary} />
                </View>
              </Pressable>
            </View>
          </View>
        </FormSectionCard>

        <FormSectionCard title="Preferences & Pricing" icon="options-outline">
          <CheckboxRow
            label="Max 2 people in back seat"
            checked={draft.maxTwoInBackSeat}
            onToggle={() => updateDraft({ maxTwoInBackSeat: !draft.maxTwoInBackSeat })}
          />

          <SeatStepper
            value={draft.availableSeats}
            onChange={(availableSeats) => updateDraft({ availableSeats })}
          />

          <Text style={styles.sectionLabel}>Gender Preference</Text>
          <CheckboxRow
            label="Accept women only"
            checked={draft.womenOnly}
            onToggle={() => updateDraft({ womenOnly: !draft.womenOnly })}
          />

          <Text style={styles.fieldLabel}>Price per Seat</Text>
          <View style={[styles.pressableField, styles.fieldIconRow]}>
            <Text style={styles.fieldValue}>₹</Text>
            <TextInput
              style={styles.priceInput}
              value={draft.pricePerSeat}
              onChangeText={(pricePerSeat) => updateDraft({ pricePerSeat })}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textPlaceholder}
              accessibilityLabel="Price per seat"
            />
          </View>
        </FormSectionCard>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label="Next"
          onPress={submit}
          variant="primary"
          showArrow
          disabled={!isValid}
          accessibilityLabel="Continue to next step"
        />
      </View>

      <NativeDatePicker
        visible={datePickerOpen}
        value={selectedDate}
        minimumDate={minimumDate}
        title="Departure Date"
        onChange={selectDate}
        onClose={closeDatePicker}
      />

      <AppFooter />
    </SafeAreaView>
  );
};
