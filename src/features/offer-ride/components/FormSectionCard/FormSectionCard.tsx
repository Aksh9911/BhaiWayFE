import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './FormSectionCard.styles';
import type { FormSectionCardProps } from './FormSectionCard.types';
import { AppText as Text } from '@/shared/components';

export const FormSectionCard = ({ title, icon, children }: FormSectionCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Ionicons name={icon as never} size={18} color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
    </View>
    {children}
  </View>
);
