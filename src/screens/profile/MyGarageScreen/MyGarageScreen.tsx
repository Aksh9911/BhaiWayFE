import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import {
  GARAGE_WHY_IMAGE,
  MY_GARAGE_SCREEN,
  VEHICLE_RC_STATUS_LABEL,
} from '@/features/profile/constants';
import { useMyGarage } from '@/features/profile/hooks';
import type { VehicleRcStatus } from '@/features/profile/types';
import { garageTokens, styles } from './MyGarageScreen.styles';

const rcStatusUi = (status: VehicleRcStatus) => {
  if (status === 'approved') {
    return {
      badge: styles.statusApproved,
      label: styles.statusLabelApproved,
      icon: 'checkmark-circle' as const,
      color: garageTokens.APPROVED_TEXT,
    };
  }
  return {
    badge: styles.statusPending,
    label: styles.statusLabelPending,
    icon: 'time' as const,
    color: garageTokens.PENDING_TEXT,
  };
};

export const MyGarageScreen = () => {
  const { vehicles, goBack, openVehicleMenu, addVehicle } = useMyGarage();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleBack}
          color={garageTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {MY_GARAGE_SCREEN.title}
        </Text>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>{MY_GARAGE_SCREEN.heroEyebrow}</Text>
            <Text style={styles.heroTitle}>{MY_GARAGE_SCREEN.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{MY_GARAGE_SCREEN.heroSubtitle}</Text>
            <View style={styles.heroIcon} pointerEvents="none">
              <Ionicons name="car" size={180} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.vehicleList}>
            {vehicles.map((vehicle) => {
              const status = rcStatusUi(vehicle.rcStatus);
              return (
                <Pressable
                  key={vehicle.id}
                  style={({ pressed }) => [
                    styles.vehicleCard,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => openVehicleMenu(vehicle)}
                  accessibilityRole="button"
                  accessibilityLabel={`${vehicle.name}. ${vehicle.plateNumber}. ${VEHICLE_RC_STATUS_LABEL[vehicle.rcStatus]}`}
                >
                  <View style={styles.vehicleLeft}>
                    <View style={styles.vehicleIcon}>
                      <Ionicons name="car" size={28} color={garageTokens.PRIMARY} />
                    </View>
                    <View style={styles.vehicleMeta}>
                      <Text style={styles.vehicleName}>{vehicle.name}</Text>
                      <Text style={styles.vehiclePlate}>{vehicle.plateNumber}</Text>
                      <View style={[styles.statusBadge, status.badge]}>
                        <Ionicons name={status.icon} size={14} color={status.color} />
                        <Text style={[styles.statusLabel, status.label]}>
                          {VEHICLE_RC_STATUS_LABEL[vehicle.rcStatus]}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.moreButton,
                      pressed && { backgroundColor: garageTokens.SURFACE_CONTAINER },
                    ]}
                    onPress={() => openVehicleMenu(vehicle)}
                    accessibilityRole="button"
                    accessibilityLabel={`More options for ${vehicle.name}`}
                    hitSlop={8}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color={garageTokens.SECONDARY} />
                  </Pressable>
                </Pressable>
              );
            })}

            <View style={styles.whyCard}>
              <View style={styles.whyContent}>
                <Ionicons name="shield-checkmark-outline" size={36} color={garageTokens.PRIMARY} />
                <Text style={styles.whyTitle}>{MY_GARAGE_SCREEN.whyTitle}</Text>
                <Text style={styles.whyBody}>{MY_GARAGE_SCREEN.whyBody}</Text>
              </View>
              <Image
                source={{ uri: GARAGE_WHY_IMAGE }}
                style={styles.whyImage}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                accessibilityLabel="Vehicle interior"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomAction}>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
            onPress={addVehicle}
            accessibilityRole="button"
            accessibilityLabel={MY_GARAGE_SCREEN.addVehicleLabel}
          >
            <Ionicons name="add-circle" size={22} color={garageTokens.ON_PRIMARY_CONTAINER} />
            <Text style={styles.addLabel}>{MY_GARAGE_SCREEN.addVehicleLabel}</Text>
          </Pressable>
        </View>
      </View>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
