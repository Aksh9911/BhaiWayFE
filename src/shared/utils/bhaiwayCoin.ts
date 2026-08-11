import type { ImageSourcePropType } from 'react-native';

export const BHAIWAY_COIN_IMAGE: ImageSourcePropType = require('../../../assets/images/bhaiway-coin.png');

/** @deprecated Prefer BhaiWayCoinIcon — kept for rare plain-text fallbacks. */
export const BHAIWAY_COIN_ICON = '';

export const BHAIWAY_COIN_NAME = 'BhaiWay Coin';
export const BHAIWAY_COINS_NAME = 'BhaiWay Coins';

const formatNumber = (amount: number, minimumFractionDigits = 0): string =>
  amount.toLocaleString('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  });

/** Formats a coin amount as digits only (e.g. "1,000"). Pair with BhaiWayCoinIcon in UI. */
export const formatBhaiWayCoins = (
  amount: number,
  options?: {
    spaced?: boolean;
    minimumFractionDigits?: number;
  },
): string => {
  const minimumFractionDigits = options?.minimumFractionDigits ?? (amount % 1 === 0 ? 0 : 2);
  return formatNumber(amount, minimumFractionDigits);
};

export const formatSignedBhaiWayCoins = (
  amount: number,
  options?: {
    sign?: '+' | '-';
    spaced?: boolean;
    minimumFractionDigits?: number;
  },
): string => {
  const sign = options?.sign ?? (amount < 0 ? '-' : '+');
  const formatted = formatBhaiWayCoins(Math.abs(amount), {
    spaced: options?.spaced ?? true,
    minimumFractionDigits: options?.minimumFractionDigits,
  });
  const gap = options?.spaced === false ? '' : ' ';
  return `${sign}${gap}${formatted}`;
};
