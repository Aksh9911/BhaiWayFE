import React from 'react';

import { InfoBanner } from '@/shared/components';
import type { VerificationBannerProps } from './VerificationBanner.types';

/** Office-commute wrapper around shared InfoBanner (accent variant). */
export const VerificationBanner = React.memo(
  ({ title, description, actionLabel, onPress }: VerificationBannerProps) => (
    <InfoBanner
      variant="accent"
      title={title}
      description={description}
      actionLabel={actionLabel}
      onActionPress={onPress}
    />
  ),
);

VerificationBanner.displayName = 'VerificationBanner';
