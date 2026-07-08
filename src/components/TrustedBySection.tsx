import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';

const FIRST_ROW_COMPANIES = ['Acme Corp', 'GlobalTech'] as const;
const SECOND_ROW_COMPANIES = ['Nexus'] as const;

export default function TrustedBySection() {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.label}>TRUSTED BY MODERN TEAMS</Text>
      <View style={styles.companiesContainer}>
        <View style={styles.companyRow}>
          {FIRST_ROW_COMPANIES.map((company) => (
            <Text key={company} style={styles.companyName}>
              {company}
            </Text>
          ))}
        </View>
        <View style={styles.companyRow}>
          {SECOND_ROW_COMPANIES.map((company) => (
            <Text key={company} style={styles.companyName}>
              {company}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.trustedSectionMarginTop,
  },
  divider: {
    width: layout.dividerWidthPercent,
    height: 1,
    backgroundColor: colors.divider,
  },
  label: {
    ...typography.trustedLabel,
    color: colors.textTrusted,
    textTransform: 'uppercase',
    marginTop: spacing.trustedLabelMarginTop,
    textAlign: 'center',
  },
  companiesContainer: {
    width: layout.dividerWidthPercent,
    marginTop: spacing.lg,
    alignItems: 'center',
    gap: spacing.companyRowGap,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  companyName: {
    ...typography.companyName,
    color: colors.textCompany,
    textAlign: 'center',
  },
});
