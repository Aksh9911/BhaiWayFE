import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ROUTES } from '@/config';
import {
  EMERGENCY_END_ISSUES,
  EMERGENCY_END_TRIP_SCREEN,
} from '../constants';
import type {
  EmergencyEndIssueId,
  EmergencyEvidencePhoto,
} from '../types';

export interface UseEmergencyEndTripResult {
  issues: typeof EMERGENCY_END_ISSUES;
  selectedIssue: EmergencyEndIssueId | null;
  comments: string;
  photos: EmergencyEvidencePhoto[];
  submitting: boolean;
  selectIssue: (id: EmergencyEndIssueId) => void;
  setComments: (value: string) => void;
  capturePhoto: () => Promise<void>;
  removePhoto: (id: string) => void;
  submit: () => void;
  goBack: () => void;
  openSupport: () => void;
}

export const useEmergencyEndTrip = (): UseEmergencyEndTripResult => {
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState<EmergencyEndIssueId | null>(null);
  const [comments, setComments] = useState('');
  const [photos, setPhotos] = useState<EmergencyEvidencePhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRidesActiveTrip);
  }, [router]);

  const openSupport = useCallback(() => {
    router.push(ROUTES.supportChat);
  }, [router]);

  const selectIssue = useCallback((id: EmergencyEndIssueId) => {
    setSelectedIssue(id);
  }, []);

  const capturePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Allow camera access to upload evidence.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    setPhotos((prev) => [
      ...prev,
      { id: `photo-${Date.now()}`, uri: result.assets[0].uri },
    ]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }, []);

  const submit = useCallback(() => {
    if (!selectedIssue) {
      Alert.alert('Select an issue', EMERGENCY_END_TRIP_SCREEN.selectIssueMessage);
      return;
    }
    if (submitting) {
      return;
    }

    setSubmitting(true);
    router.replace(ROUTES.myRidesRequestRaised);
  }, [router, selectedIssue, submitting]);

  return {
    issues: EMERGENCY_END_ISSUES,
    selectedIssue,
    comments,
    photos,
    submitting,
    selectIssue,
    setComments,
    capturePhoto,
    removePhoto,
    submit,
    goBack,
    openSupport,
  };
};
