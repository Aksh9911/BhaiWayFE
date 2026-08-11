import React, { useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getBhaiWayWalletBalance, subscribeBhaiWayWallet } from '@/DemoData';
import { AppText as Text, BhaiWayCoinIcon } from '@/shared/components';
import { colors } from '@/shared/theme';
import { formatBhaiWayCoins } from '@/shared/utils';
import {
  PAYMENT_METHODS,
  PAYMENT_SCREEN,
  POPULAR_BANKS,
  getBankPaymentMethodId,
} from '../../constants';
import { savedCardStore } from '../../store/savedCardStore';
import { savedUpiStore } from '../../store/savedUpiStore';
import type { PaymentMethodId } from '../../types';
import { styles } from './PaymentMethodList.styles';

export interface PaymentMethodListProps {
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  onAddCoins: () => void;
  onAddUpi: () => void;
  onAddCard: () => void;
  onSeeAllBanks: () => void;
  /**
   * Rider fare payment only. Hide for drivers (publish flow).
   * Shown for both Regular and Assured — Assured still charges the fee upfront.
   */
  showPayAfterRide?: boolean;
  /** Overrides the default Pay After Ride subtitle (e.g. Assured fee note). */
  payAfterSubtitle?: string;
}

const Radio = ({ selected }: { selected: boolean }) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
    {selected ? <View style={styles.radioInner} /> : null}
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export const PaymentMethodList = React.memo(
  ({
    selectedId,
    onSelect,
    onAddCoins,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
    showPayAfterRide = true,
    payAfterSubtitle,
  }: PaymentMethodListProps) => {
    const savedUpis = useSyncExternalStore(savedUpiStore.subscribe, savedUpiStore.get);
    const savedCards = useSyncExternalStore(savedCardStore.subscribe, savedCardStore.get);
    const walletBalance = useSyncExternalStore(subscribeBhaiWayWallet, getBhaiWayWalletBalance);
    const wallet = PAYMENT_METHODS.find((m) => m.kind === 'wallet')!;
    const upiMethods = PAYMENT_METHODS.filter((m) => m.kind === 'upi');
    const card = PAYMENT_METHODS.find((m) => m.kind === 'card')!;
    const payAfter = PAYMENT_METHODS.find((m) => m.kind === 'pay-after')!;

    return (
      <>
        {/* Wallet */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.walletTitle} />
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => onSelect(wallet.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === wallet.id }}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.iconWrap}>
                <BhaiWayCoinIcon size={22} />
              </View>
              <View style={styles.meta}>
                <Text style={styles.label}>{wallet.label}</Text>
                <View style={styles.balanceRow}>
                  <Text style={styles.subtitle}>Balance: </Text>
                  <BhaiWayCoinIcon size={14} />
                  <Text style={styles.balanceValue}>
                    {formatBhaiWayCoins(walletBalance, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
              <Radio selected={selectedId === wallet.id} />
            </Pressable>
            <View style={styles.rowDivider} />
            <Pressable
              style={styles.addRow}
              onPress={onAddCoins}
              accessibilityRole="button"
              accessibilityLabel={PAYMENT_SCREEN.addCoinsLabel}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={22} color={colors.primary} />
              </View>
              <Text style={styles.addLabel}>{PAYMENT_SCREEN.addCoinsLabel}</Text>
            </Pressable>
          </View>
        </View>

        {/* UPI */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.upiTitle} />
          <View style={styles.card}>
            {upiMethods.map((method, index) => (
              <React.Fragment key={method.id}>
                {index > 0 ? <View style={styles.rowDivider} /> : null}
                <Pressable
                  style={styles.row}
                  onPress={() => onSelect(method.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedId === method.id }}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                >
                  <View style={styles.upiIconWrap}>
                    <Ionicons
                      name={method.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.labelMedium}>{method.label}</Text>
                  </View>
                  <Radio selected={selectedId === method.id} />
                </Pressable>
              </React.Fragment>
            ))}
            {savedUpis.map((upi) => (
              <React.Fragment key={upi.id}>
                <View style={styles.rowDivider} />
                <Pressable
                  style={styles.row}
                  onPress={() => onSelect(upi.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedId === upi.id }}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                >
                  <View style={styles.upiIconWrap}>
                    <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.labelMedium}>{upi.label}</Text>
                    {upi.label !== upi.upiId ? (
                      <Text style={styles.subtitle}>{upi.upiId}</Text>
                    ) : null}
                  </View>
                  <Radio selected={selectedId === upi.id} />
                </Pressable>
              </React.Fragment>
            ))}
            <View style={styles.rowDivider} />
            <Pressable
              style={styles.addRow}
              onPress={onAddUpi}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.addIcon}>
                <Ionicons name="add" size={22} color={colors.primary} />
              </View>
              <Text style={styles.addLabel}>{PAYMENT_SCREEN.addUpiLabel}</Text>
            </Pressable>
          </View>
        </View>

        {/* Saved Cards */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.cardsTitle} />
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => onSelect(card.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedId === card.id }}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.visaBadge}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.labelMedium}>{card.label}</Text>
                <Text style={styles.subtitle}>{card.subtitle}</Text>
              </View>
              <Radio selected={selectedId === card.id} />
            </Pressable>
            {savedCards.map((saved) => (
              <React.Fragment key={saved.id}>
                <View style={styles.rowDivider} />
                <Pressable
                  style={styles.row}
                  onPress={() => onSelect(saved.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedId === saved.id }}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                >
                  <View style={styles.visaBadge}>
                    <Text style={styles.visaText}>{saved.brandLabel.slice(0, 4).toUpperCase()}</Text>
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.labelMedium}>{saved.label}</Text>
                    <Text style={styles.subtitle}>{saved.subtitle}</Text>
                  </View>
                  <Radio selected={selectedId === saved.id} />
                </Pressable>
              </React.Fragment>
            ))}
            <View style={styles.rowDivider} />
            <Pressable
              style={styles.addRow}
              onPress={onAddCard}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <View style={styles.addIcon}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.addLabel}>{PAYMENT_SCREEN.addCardLabel}</Text>
            </Pressable>
          </View>
        </View>

        {/* Net Banking */}
        <View style={styles.section}>
          <SectionTitle title={PAYMENT_SCREEN.bankingTitle} />
          <View style={styles.card}>
            <View style={styles.banksGrid}>
              {POPULAR_BANKS.map((bank, index) => {
                const bankMethodId = getBankPaymentMethodId(bank.id);
                return (
                  <Pressable
                    key={bank.id}
                    style={[
                      styles.bankItem,
                      index === POPULAR_BANKS.length - 1 && styles.bankItemLast,
                      selectedId === bankMethodId && styles.bankItemSelected,
                    ]}
                    onPress={() => onSelect(bankMethodId)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selectedId === bankMethodId }}
                    accessibilityLabel={`Pay with ${bank.label}`}
                    android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
                  >
                    <View style={styles.bankIcon}>
                      <Ionicons name="business" size={28} color={bank.color} />
                    </View>
                    <Text style={styles.bankLabel}>{bank.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              style={styles.seeAll}
              onPress={onSeeAllBanks}
              accessibilityRole="button"
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <Text style={styles.seeAllLabel}>{PAYMENT_SCREEN.seeAllBanksLabel}</Text>
              <Ionicons name="chevron-forward" size={20} color="#45464D" />
            </Pressable>
          </View>
        </View>

        {/* Pay After Ride — riders only, for ride fare (not Assured security deposit) */}
        {showPayAfterRide ? (
          <View style={styles.section}>
            <SectionTitle title={PAYMENT_SCREEN.payAfterTitle} />
            <View style={styles.card}>
              <Pressable
                style={styles.row}
                onPress={() => onSelect(payAfter.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedId === payAfter.id }}
                android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name="repeat-outline" size={22} color={colors.primary} />
                </View>
                <View style={styles.meta}>
                  <Text style={styles.label}>{payAfter.label}</Text>
                  <Text style={styles.subtitle}>{payAfterSubtitle || payAfter.subtitle}</Text>
                </View>
                <Radio selected={selectedId === payAfter.id} />
              </Pressable>
            </View>
          </View>
        ) : null}
      </>
    );
  },
);

PaymentMethodList.displayName = 'PaymentMethodList';
