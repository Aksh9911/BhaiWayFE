import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  DashedUploadCard,
  IconButton,
  ScreenHeader,
  UploadDocumentSheet,
  AppText as Text,
  AppTextInput as TextInput,
} from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { REPORT_ISSUE_SCREEN } from '@/features/my-rides/constants';
import { useReportIssue } from '@/features/my-rides/hooks';
import { styles } from './ReportIssueScreen.styles';

export const ReportIssueScreen = () => {
  const {
    ride,
    form,
    categories,
    photoStatus,
    submitting,
    uploadSheetVisible,
    selectCategory,
    setDescription,
    openUpload,
    closeUpload,
    applyUploadedDocument,
    submit,
    openInfo,
    goBack,
  } = useReportIssue();

  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleSubmit = useCallback(() => {
    void submit();
  }, [submit]);

  const isBusy = submitting || photoStatus === 'uploading';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={REPORT_ISSUE_SCREEN.title}
          onBack={handleBack}
          right={
            <IconButton
              icon="information-circle-outline"
              onPress={openInfo}
              color="#434655"
              accessibilityLabel="Reporting tips"
            />
          }
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{REPORT_ISSUE_SCREEN.rideSummaryTitle}</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryBody}>
              <View style={styles.routeTrack}>
                <View style={styles.originDot} />
                <View style={styles.routeLine} />
                <Ionicons name="location" size={20} color={colors.primary} />
              </View>
              <View style={styles.stopMeta}>
                <View style={styles.stopBlock}>
                  <Text style={styles.stopLabel}>{REPORT_ISSUE_SCREEN.originLabel}</Text>
                  <Text style={styles.stopValue}>{ride.originLabel}</Text>
                </View>
                <View style={styles.stopBlock}>
                  <Text style={styles.stopLabel}>{REPORT_ISSUE_SCREEN.destinationLabel}</Text>
                  <Text style={styles.stopValue}>{ride.destinationLabel}</Text>
                </View>
              </View>
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.stopLabel}>{REPORT_ISSUE_SCREEN.dateLabel}</Text>
              <Text style={styles.stopValue}>{ride.dateLabel}</Text>
              <View style={styles.statusChip}>
                <Ionicons name="checkmark-circle" size={14} color="#191C1D" />
                <Text style={styles.statusChipText}>{ride.statusLabel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{REPORT_ISSUE_SCREEN.categoryTitle}</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const selected = form.categoryId === category.id;
              return (
                <Pressable
                  key={category.id}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    selected && styles.categoryCardSelected,
                    pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => selectCategory(category.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={category.label}
                >
                  <View
                    style={[
                      styles.categoryIconWrap,
                      selected && styles.categoryIconWrapSelected,
                    ]}
                  >
                    <Ionicons
                      name={category.icon}
                      size={22}
                      color={selected ? colors.white : colors.primary}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.sectionTitle}>{REPORT_ISSUE_SCREEN.descriptionLabel}</Text>
            <TextInput
              style={[styles.textArea, descriptionFocused && styles.textAreaFocused]}
              value={form.description}
              onChangeText={setDescription}
              placeholder={REPORT_ISSUE_SCREEN.descriptionPlaceholder}
              placeholderTextColor="#747686"
              multiline
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              accessibilityLabel={REPORT_ISSUE_SCREEN.descriptionLabel}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.sectionTitle}>{REPORT_ISSUE_SCREEN.photoLabel}</Text>
            <DashedUploadCard
              status={photoStatus}
              title={REPORT_ISSUE_SCREEN.photoLabel}
              subtitle={REPORT_ISSUE_SCREEN.photoHint}
              uploadingLabel={REPORT_ISSUE_SCREEN.uploadingLabel}
              uploadedLabel={REPORT_ISSUE_SCREEN.uploadedLabel}
              uploadedMeta={form.photoFileName ?? undefined}
              onPress={openUpload}
            />
            {form.photoUri ? (
              <View style={styles.uploadPreview}>
                <Image
                  source={{ uri: form.photoUri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                  accessibilityLabel="Uploaded issue photo"
                />
              </View>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              isBusy && styles.submitButtonDisabled,
              pressed && !isBusy && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleSubmit}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel={REPORT_ISSUE_SCREEN.submitLabel}
          >
            {submitting ? (
              <>
                <ActivityIndicator color={colors.white} />
                <Text style={styles.submitLabel}>{REPORT_ISSUE_SCREEN.submittingLabel}</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitLabel}>{REPORT_ISSUE_SCREEN.submitLabel}</Text>
                <Ionicons name="send" size={18} color={colors.white} />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <UploadDocumentSheet
        visible={uploadSheetVisible}
        onClose={closeUpload}
        onPicked={(document) => {
          void applyUploadedDocument(document);
        }}
        title={REPORT_ISSUE_SCREEN.uploadTitle}
        subtitle={REPORT_ISSUE_SCREEN.uploadSubtitle}
        imagePickerOptions={{
          allowsEditing: true,
          quality: 0.85,
        }}
      />

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
