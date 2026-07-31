import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform, Text, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, layout, spacing } from '@/shared/theme';
import { styles } from './OTPInput.styles';
import type { OTPInputProps } from './OTPInput.types';

const DEFAULT_CELL_COUNT = 4;

interface OTPCellProps {
  index: number;
  totalCells: number;
  symbol: string;
  isFocused: boolean;
  cellSize: number;
  onLayout: (event: LayoutChangeEvent) => void;
}

const OTPCell = ({ index, totalCells, symbol, isFocused, cellSize, onLayout }: OTPCellProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1.04 : 1, { duration: 150 });
  }, [isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isFocused ? colors.primary : colors.border,
  }));

  return (
    <Animated.View
      style={[styles.cell, { width: cellSize, height: cellSize }, animatedStyle]}
      onLayout={onLayout}
      accessibilityLabel={`Digit ${index + 1} of ${totalCells}`}
    >
      <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : '')}</Text>
    </Animated.View>
  );
};

export const OTPInput = ({
  value,
  onChange,
  cellCount = DEFAULT_CELL_COUNT,
  error,
}: OTPInputProps) => {
  const { width } = useWindowDimensions();
  const cellSize = useMemo(() => {
    const horizontalPadding = spacing.screenHorizontal * 2;
    const gapTotal = spacing.md * (cellCount - 1);
    const availableWidth = width - horizontalPadding - gapTotal;
    const computed = Math.floor(availableWidth / cellCount);
    return Math.max(48, Math.min(layout.otpBoxSize, computed));
  }, [cellCount, width]);

  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChange,
  });

  const renderCell = useCallback(
    ({ index, symbol, isFocused }: { index: number; symbol: string; isFocused: boolean }) => (
      <OTPCell
        key={index}
        index={index}
        totalCells={cellCount}
        symbol={symbol}
        isFocused={isFocused}
        cellSize={cellSize}
        onLayout={getCellOnLayoutHandler(index)}
      />
    ),
    [cellCount, cellSize, getCellOnLayoutHandler],
  );

  return (
    <>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onChange}
        cellCount={cellCount}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        renderCell={renderCell}
        accessibilityLabel="One-time password input"
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </>
  );
};
