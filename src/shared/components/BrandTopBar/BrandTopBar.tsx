import type { ReactNode } from 'react';
import { Text } from 'react-native';

import { APP_CONFIG } from '@/config/constants';
import { colors, typography } from '@/shared/theme';
import { AppTopBar } from '../AppTopBar/AppTopBar';
import { IconButton } from '../IconButton/IconButton';

export interface BrandTopBarProps {
  onMenuPress: () => void;
  right: ReactNode;
}

export const BrandTopBar = ({ onMenuPress, right }: BrandTopBarProps) => (
  <AppTopBar
    left={
      <IconButton
        icon="menu"
        onPress={onMenuPress}
        size={26}
        color={colors.textPrimary}
        accessibilityLabel="Go back"
      />
    }
    center={
      <Text style={[typography.title, { color: colors.textPrimary }]} accessibilityRole="header">
        {APP_CONFIG.name}
      </Text>
    }
    right={right}
  />
);
