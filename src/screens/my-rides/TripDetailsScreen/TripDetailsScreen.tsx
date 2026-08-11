import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  Avatar,
  ScreenHeader,
  AppText as Text,
} from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { TRIP_DETAILS_SCREEN } from '@/features/my-rides/constants';
import { useTripDetails } from '@/features/my-rides/hooks';
import { styles } from './TripDetailsScreen.styles';

export const TripDetailsScreen = () => {
  const { trip, downloadInvoice, goBack } = useTripDetails();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={TRIP_DETAILS_SCREEN.title}
          onBack={handleBack}
          right={
            <Avatar
              size={40}
              uri={trip.avatarUri}
              accessibilityLabel="Driver profile photo"
            />
          }
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapCard}>
          <Image
            source={{ uri: trip.mapImageUri }}
            style={styles.mapImage}
            resizeMode="cover"
            accessibilityLabel="Trip route map"
          />
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.completedBadgeText}>{trip.statusLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.summaryGrid}>
            <View style={styles.routeBlock}>
              <Text style={styles.metaLabel}>{TRIP_DETAILS_SCREEN.routeLabel}</Text>
              <View style={styles.routeRow}>
                <Text style={styles.routeCity}>{trip.origin}</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.textMuted} />
                <Text style={styles.routeCity}>{trip.destination}</Text>
              </View>
              <Text style={styles.dateText}>{trip.dateLabel}</Text>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>{TRIP_DETAILS_SCREEN.durationLabel}</Text>
              <Text style={styles.metaValue}>{trip.durationLabel}</Text>
            </View>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>{TRIP_DETAILS_SCREEN.distanceLabel}</Text>
              <Text style={styles.metaValue}>{trip.distanceLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleLeft}>
              <View style={styles.vehicleIcon}>
                <Ionicons name="car" size={24} color={colors.primary} />
              </View>
              <View style={styles.vehicleMeta}>
                <Text style={styles.metaLabel}>{TRIP_DETAILS_SCREEN.vehicleLabel}</Text>
                <Text style={styles.vehicleName}>{trip.vehicle.name}</Text>
                <Text style={styles.vehiclePlate}>{trip.vehicle.plateNumber}</Text>
              </View>
            </View>
            <Ionicons name="shield-checkmark" size={22} color={colors.textMuted} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.earningsTitle}>{TRIP_DETAILS_SCREEN.earningsTitle}</Text>
          <View style={styles.earningsList}>
            {trip.earningsLines.map((line, index) => {
              const isLast = index === trip.earningsLines.length - 1;
              const isBonus = line.kind === 'bonus';
              return (
                <View
                  key={line.id}
                  style={[styles.earningsRow, isLast && styles.earningsRowLast]}
                >
                  <View style={styles.earningsPerson}>
                    <View style={[styles.initials, isBonus && styles.initialsBonus]}>
                      {isBonus ? (
                        <Ionicons name="star" size={14} color={colors.primary} />
                      ) : (
                        <Text style={styles.initialsText}>{line.initials}</Text>
                      )}
                    </View>
                    {isBonus ? (
                      <Text style={styles.bonusLabel}>{line.name}</Text>
                    ) : (
                      <Text style={styles.personName}>
                        {line.name}{' '}
                        <Text style={styles.personTag}>({line.tag})</Text>
                      </Text>
                    )}
                  </View>
                  <Text style={isBonus ? styles.bonusAmount : styles.amount}>
                    {line.amountLabel}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{TRIP_DETAILS_SCREEN.totalLabel}</Text>
            <Text style={styles.totalValue}>{trip.totalEarningsLabel}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.downloadBtn, pressed && { opacity: 0.9 }]}
          onPress={downloadInvoice}
          accessibilityRole="button"
          accessibilityLabel={TRIP_DETAILS_SCREEN.downloadInvoiceLabel}
        >
          <Ionicons name="download-outline" size={22} color={colors.textMuted} />
          <Text style={styles.downloadLabel}>{TRIP_DETAILS_SCREEN.downloadInvoiceLabel}</Text>
        </Pressable>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
