import React from 'react';

import { WarningCallout } from '@/shared/components';
import { RIDE_PREFERENCES_SCREEN } from '../../constants';
import { PaymentSummaryCard } from '../PaymentSummaryCard';
import { PromoCodeField } from '../PromoCodeField';
import { ScreenSection } from '../ScreenSection';
import type { AssuredPaymentBlockProps } from './AssuredPaymentBlock.types';

/**
 * Assured-only preference extras: promo + payment summary + cancel note.
 * Keep Regular screens free of this block via `isAssured` gating at the screen.
 */
export const AssuredPaymentBlock = ({
  promoCode,
  onPromoChange,
  onApplyPromo,
  refundableAmountLabel,
  totalToPayLabel,
}: AssuredPaymentBlockProps) => (
  <>
    <ScreenSection title={RIDE_PREFERENCES_SCREEN.promoTitle}>
      <PromoCodeField
        value={promoCode}
        onChangeText={onPromoChange}
        onApply={onApplyPromo}
        placeholder={RIDE_PREFERENCES_SCREEN.promoPlaceholder}
        applyLabel={RIDE_PREFERENCES_SCREEN.promoApplyLabel}
        accessibilityLabel={RIDE_PREFERENCES_SCREEN.promoTitle}
      />
    </ScreenSection>

    <ScreenSection title={RIDE_PREFERENCES_SCREEN.paymentTitle}>
      <PaymentSummaryCard
        rows={[
          {
            label: RIDE_PREFERENCES_SCREEN.refundableLabel,
            value: refundableAmountLabel,
            hint: RIDE_PREFERENCES_SCREEN.refundableHint,
          },
        ]}
        totalLabel={RIDE_PREFERENCES_SCREEN.totalToPayLabel}
        totalValue={totalToPayLabel}
      />
      <WarningCallout
        prefix={RIDE_PREFERENCES_SCREEN.assuredNotePrefix}
        message={RIDE_PREFERENCES_SCREEN.assuredNote}
      />
    </ScreenSection>
  </>
);
