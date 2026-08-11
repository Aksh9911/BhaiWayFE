import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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
import { RIDE_INVOICE_SCREEN } from '@/features/my-rides/constants';
import { useRideInvoice } from '@/features/my-rides/hooks';
import { styles } from './RideInvoiceScreen.styles';

export const RideInvoiceScreen = () => {
  const { invoice, downloadPdf, reportIssue, openPaymentMethod, goBack } = useRideInvoice();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={RIDE_INVOICE_SCREEN.title}
          onBack={handleBack}
          right={
            <Avatar
              size={32}
              uri={invoice.avatarUri}
              accessibilityLabel="Profile photo"
            />
          }
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, styles.summaryCard]}>
          <Text style={styles.totalCaption}>{RIDE_INVOICE_SCREEN.totalAmountLabel}</Text>
          <Text style={styles.totalAmount}>{invoice.totalAmountLabel}</Text>
          <View style={styles.metaBlock}>
            <Text style={styles.metaText}>
              {RIDE_INVOICE_SCREEN.invoiceIdLabel}{' '}
              <Text style={styles.metaStrong}>{invoice.invoiceId}</Text>
            </Text>
            <Text style={styles.metaText}>
              {RIDE_INVOICE_SCREEN.dateLabel}{' '}
              <Text style={styles.metaStrong}>{invoice.dateLabel}</Text>
            </Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusChipText}>{invoice.statusLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{RIDE_INVOICE_SCREEN.tripDetailsTitle}</Text>
          <View style={styles.tripTrack}>
            <View style={styles.dashLine} />
            <View style={styles.stopBlock}>
              <View style={styles.stopDotOuter} />
              <Text style={styles.stopLabel}>{RIDE_INVOICE_SCREEN.pickupLabel}</Text>
              <Text style={styles.stopValue}>{invoice.pickupLabel}</Text>
              <Text style={styles.stopTime}>{invoice.pickupTimeLabel}</Text>
            </View>
            <View style={styles.stopBlock}>
              <View style={styles.stopDotFilled} />
              <Text style={styles.stopLabel}>{RIDE_INVOICE_SCREEN.dropoffLabel}</Text>
              <Text style={styles.stopValue}>{invoice.dropoffLabel}</Text>
              <Text style={styles.stopTime}>{invoice.dropoffTimeLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.driverHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
              {RIDE_INVOICE_SCREEN.driverDetailsTitle}
            </Text>
            {invoice.driver.verified ? (
              <View style={styles.verifiedChip}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.verifiedText}>{RIDE_INVOICE_SCREEN.verifiedLabel}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Avatar
                size={48}
                uri={invoice.driver.avatarUri}
                accessibilityLabel={`${invoice.driver.name} photo`}
              />
            </View>
            <View style={styles.driverMeta}>
              <Text style={styles.driverName}>{invoice.driver.name}</Text>
              <Text style={styles.driverVehicle}>
                {invoice.driver.vehicleLabel} • {invoice.driver.plateNumber}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{RIDE_INVOICE_SCREEN.fareBreakdownTitle}</Text>
          {invoice.fareLines.map((line) => (
            <View key={line.id} style={styles.fareRow}>
              <Text
                style={[
                  styles.fareLabel,
                  line.tone === 'discount' && styles.fareDiscount,
                ]}
              >
                {line.label}
              </Text>
              <Text
                style={[
                  styles.fareValue,
                  line.tone === 'discount' && styles.fareDiscount,
                ]}
              >
                {line.amountLabel}
              </Text>
            </View>
          ))}
          <View style={styles.fareTotalRow}>
            <Text style={styles.fareTotalLabel}>{RIDE_INVOICE_SCREEN.totalPaidLabel}</Text>
            <Text style={styles.fareTotalValue}>{invoice.paidAmountLabel}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.card, styles.paymentRow, pressed && { opacity: 0.92 }]}
          onPress={openPaymentMethod}
          accessibilityRole="button"
          accessibilityLabel={RIDE_INVOICE_SCREEN.paymentMethodTitle}
        >
          <View style={styles.paymentLeft}>
            <View style={styles.paymentIconWrap}>
              <Ionicons name="wallet" size={20} color={colors.primary} />
            </View>
            <View style={styles.paymentMeta}>
              <Text style={styles.paymentCaption}>{RIDE_INVOICE_SCREEN.paymentMethodTitle}</Text>
              <Text style={styles.paymentValue}>{invoice.paymentMethodLabel}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#585E72" />
        </Pressable>

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.9 }]}
            onPress={downloadPdf}
            accessibilityRole="button"
            accessibilityLabel={RIDE_INVOICE_SCREEN.downloadPdfLabel}
          >
            <Ionicons name="download-outline" size={20} color="#191C1D" />
            <Text style={styles.actionLabel}>{RIDE_INVOICE_SCREEN.downloadPdfLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.9 }]}
            onPress={reportIssue}
            accessibilityRole="button"
            accessibilityLabel={RIDE_INVOICE_SCREEN.reportIssueLabel}
          >
            <Ionicons name="flag-outline" size={20} color="#BA1A1A" />
            <Text style={[styles.actionLabel, styles.reportLabel]}>
              {RIDE_INVOICE_SCREEN.reportIssueLabel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
