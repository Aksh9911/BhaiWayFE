import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppFooter,
  Button,
  BhaiWayCoinIcon,
  KeyboardAwareScrollView,
  NativeDatePicker,
  ScreenHeader,
  AppText as Text,
  AppTextInput as TextInput,
} from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import {
  PreferenceToggleCard,
  PreferenceVehicleCard,
} from '@/features/offer-ride/components';
import { MODIFY_RIDE_SCREEN } from '@/features/my-rides/constants';
import { useModifyRide } from '@/features/my-rides/hooks';
import { styles } from './ModifyRideScreen.styles';

export const ModifyRideScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    form,
    preferenceOptions,
    vehicles,
    datePickerOpen,
    timePickerOpen,
    selectedDate,
    selectedTime,
    minimumDate,
    updateField,
    togglePreference,
    selectVehicle,
    openDatePicker,
    closeDatePicker,
    openTimePicker,
    closeTimePicker,
    selectDate,
    selectTime,
    addVehicle,
    updateRide,
    goBack,
  } = useModifyRide();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleToggleMaxTwo = useCallback(() => {
    triggerLightHaptic();
    updateField('maxTwoInBackSeat', !form.maxTwoInBackSeat);
  }, [form.maxTwoInBackSeat, updateField]);

  const decrementSeats = useCallback(() => {
    if (form.availableSeats > 1) {
      triggerLightHaptic();
      updateField('availableSeats', form.availableSeats - 1);
    }
  }, [form.availableSeats, updateField]);

  const incrementSeats = useCallback(() => {
    if (form.availableSeats < 6) {
      triggerLightHaptic();
      updateField('availableSeats', form.availableSeats + 1);
    }
  }, [form.availableSeats, updateField]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader title={MODIFY_RIDE_SCREEN.title} onBack={handleBack} />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        bottomInset={spacing.huge}
        footer={
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
            <Button
              label={MODIFY_RIDE_SCREEN.updateLabel}
              onPress={updateRide}
              accessibilityLabel={MODIFY_RIDE_SCREEN.updateLabel}
            />
          </View>
        }
      >
        <View>
          <Text style={styles.sectionTitle}>{MODIFY_RIDE_SCREEN.routeTitle}</Text>
          <View style={styles.card}>
            <View>
              <Text style={styles.fieldLabel}>Starting point</Text>
              <View style={[styles.pressableField, styles.fieldIconRow]}>
                <Ionicons name="navigate-outline" size={20} color={colors.primary} />
                <TextInput
                  style={styles.routeInput}
                  value={form.origin}
                  onChangeText={(origin) => updateField('origin', origin)}
                  placeholder="Choose starting point"
                  placeholderTextColor={colors.textPlaceholder}
                  accessibilityLabel="Starting point"
                />
              </View>
            </View>
            <View>
              <Text style={styles.fieldLabel}>Destination</Text>
              <View style={[styles.pressableField, styles.fieldIconRow]}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <TextInput
                  style={styles.routeInput}
                  value={form.destination}
                  onChangeText={(destination) => updateField('destination', destination)}
                  placeholder="Choose destination"
                  placeholderTextColor={colors.textPlaceholder}
                  accessibilityLabel="Destination"
                />
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{MODIFY_RIDE_SCREEN.schedulingTitle}</Text>
          <View style={styles.card}>
            <View>
              <Text style={styles.fieldLabel}>{MODIFY_RIDE_SCREEN.departureTimeLabel}</Text>
              <Pressable
                onPress={openTimePicker}
                style={[styles.pressableField, timePickerOpen && styles.pressableFieldActive]}
                accessibilityRole="button"
                accessibilityLabel={MODIFY_RIDE_SCREEN.departureTimeLabel}
              >
                <View style={styles.fieldIconRow}>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                  <Text style={styles.fieldValue}>{form.departureTime}</Text>
                </View>
              </Pressable>
            </View>

            <View>
              <Text style={styles.fieldLabel}>{MODIFY_RIDE_SCREEN.travelDateLabel}</Text>
              <Pressable
                onPress={openDatePicker}
                style={[styles.pressableField, datePickerOpen && styles.pressableFieldActive]}
                accessibilityRole="button"
                accessibilityLabel={MODIFY_RIDE_SCREEN.travelDateLabel}
              >
                <View style={styles.fieldIconRow}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={styles.fieldValue}>{form.departureDate}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{MODIFY_RIDE_SCREEN.seatingTitle}</Text>
          <View style={styles.seatingRow}>
            <View style={styles.seatingCard}>
              <Text style={styles.seatingLabel}>{MODIFY_RIDE_SCREEN.availableSeatsLabel}</Text>
              <View style={styles.seatControls}>
                <Pressable
                  style={styles.seatBtn}
                  onPress={decrementSeats}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease seats"
                >
                  <Ionicons name="remove" size={18} color={colors.primary} />
                </Pressable>
                <Text style={styles.seatValue}>{form.availableSeats}</Text>
                <Pressable
                  style={styles.seatBtn}
                  onPress={incrementSeats}
                  accessibilityRole="button"
                  accessibilityLabel="Increase seats"
                >
                  <Ionicons name="add" size={18} color={colors.primary} />
                </Pressable>
              </View>
            </View>

            <View style={styles.seatingCard}>
              <Text style={styles.seatingLabel}>{MODIFY_RIDE_SCREEN.pricePerSeatLabel}</Text>
              <View style={styles.priceRow}>
                <BhaiWayCoinIcon size={18} />
                <TextInput
                  style={styles.priceInput}
                  value={form.pricePerSeat}
                  onChangeText={(pricePerSeat) => updateField('pricePerSeat', pricePerSeat)}
                  keyboardType="decimal-pad"
                  accessibilityLabel={MODIFY_RIDE_SCREEN.pricePerSeatLabel}
                />
              </View>
            </View>
          </View>

          <Pressable
            style={styles.comfortRow}
            onPress={handleToggleMaxTwo}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: form.maxTwoInBackSeat }}
            accessibilityLabel={MODIFY_RIDE_SCREEN.maxTwoLabel}
          >
            <View
              style={[
                styles.comfortCheck,
                form.maxTwoInBackSeat && styles.comfortCheckSelected,
              ]}
            >
              {form.maxTwoInBackSeat ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : null}
            </View>
            <View style={styles.comfortCopy}>
              <Text style={styles.comfortTitle}>{MODIFY_RIDE_SCREEN.maxTwoLabel}</Text>
              <Text style={styles.comfortHint}>{MODIFY_RIDE_SCREEN.maxTwoHint}</Text>
            </View>
          </Pressable>
        </View>

        <View>
          <Text style={styles.sectionTitle}>{MODIFY_RIDE_SCREEN.preferencesTitle}</Text>
          <View style={styles.preferenceGrid}>
            {preferenceOptions.map((option) => (
              <View key={option.id} style={styles.preferenceItem}>
                <PreferenceToggleCard
                  label={option.label}
                  icon={option.icon}
                  selected={form.preferences[option.id]}
                  onToggle={() => togglePreference(option.id)}
                />
              </View>
            ))}
          </View>
        </View>

        <View>
          <View style={styles.vehicleHeader}>
            <Text style={styles.sectionTitle}>{MODIFY_RIDE_SCREEN.vehicleTitle}</Text>
            <Pressable
              onPress={addVehicle}
              accessibilityRole="button"
              accessibilityLabel={MODIFY_RIDE_SCREEN.addVehicleLabel}
              hitSlop={8}
            >
              <Text style={styles.addVehicle}>{MODIFY_RIDE_SCREEN.addVehicleLabel}</Text>
            </Pressable>
          </View>
          <View style={styles.vehicleList}>
            {vehicles.map((vehicle) => (
              <PreferenceVehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                selected={form.selectedVehicleId === vehicle.id}
                onSelect={() => selectVehicle(vehicle.id)}
              />
            ))}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <NativeDatePicker
        visible={datePickerOpen}
        value={selectedDate}
        minimumDate={minimumDate}
        title={MODIFY_RIDE_SCREEN.travelDateLabel}
        onChange={selectDate}
        onClose={closeDatePicker}
      />

      <NativeDatePicker
        visible={timePickerOpen}
        value={selectedTime}
        mode="time"
        title={MODIFY_RIDE_SCREEN.departureTimeLabel}
        onChange={selectTime}
        onClose={closeTimePicker}
      />

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
