import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { UploadedDocument } from '@/shared/components';
import { useSessionUser } from '@/shared/hooks';
import { triggerLightHaptic } from '@/shared/utils';
import { authSession } from '@/store';
import {
  DEFAULT_MASTER_PROFILE,
  DEFAULT_PROFILE_AVATAR,
  PROFILE_MENU_ITEMS,
  PROFILE_SCREEN,
} from '../constants';
import type { MasterProfileData, ProfileMenuActionId, ProfileMenuItem } from '../types';

export interface UseMasterProfileResult {
  profile: MasterProfileData;
  menuItems: readonly ProfileMenuItem[];
  uploadSheetVisible: boolean;
  logoutVisible: boolean;
  openCameraSheet: () => void;
  closeCameraSheet: () => void;
  applyAvatar: (document: UploadedDocument) => void;
  goBack: () => void;
  openSettings: () => void;
  openAddRedeem: () => void;
  openPaymentMethods: () => void;
  onMenuPress: (id: ProfileMenuActionId) => void;
  openLogout: () => void;
  closeLogout: () => void;
  confirmLogout: () => void;
}

export const useMasterProfile = (): UseMasterProfileResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const profile = useMemo((): MasterProfileData => {
    const fullName = user?.fullName?.trim() || DEFAULT_MASTER_PROFILE.fullName;
    const avatarUri =
      localAvatarUri ?? user?.avatarUri ?? DEFAULT_MASTER_PROFILE.avatarUri ?? DEFAULT_PROFILE_AVATAR;

    return {
      ...DEFAULT_MASTER_PROFILE,
      fullName,
      avatarUri,
    };
  }, [localAvatarUri, user?.avatarUri, user?.fullName]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  const openSettings = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
  }, []);

  const openCameraSheet = useCallback(() => {
    triggerLightHaptic();
    setUploadSheetVisible(true);
  }, []);

  const closeCameraSheet = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyAvatar = useCallback((document: UploadedDocument) => {
    setLocalAvatarUri(document.uri);
    const current = authSession.getUser();
    if (current) {
      authSession.setSession(authSession.getToken() ?? '', {
        ...current,
        avatarUri: document.uri,
      });
    }
  }, []);

  const openAddRedeem = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.wallet);
  }, [router]);

  const openPaymentMethods = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
  }, []);

  const onMenuPress = useCallback(
    (id: ProfileMenuActionId) => {
      triggerLightHaptic();

      if (id === 'verify') {
        router.push(ROUTES.officeCommuteVerify);
        return;
      }

      if (id === 'legal') {
        router.push(ROUTES.legalPolicies);
        return;
      }

      if (id === 'support') {
        router.push(ROUTES.helpSupport);
        return;
      }

      if (id === 'refer') {
        router.push(ROUTES.referEarn);
        return;
      }

      if (id === 'garage') {
        router.push(ROUTES.myGarage);
        return;
      }

      if (id === 'safety') {
        router.push(ROUTES.safetyHub);
        return;
      }

      Alert.alert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
    },
    [router],
  );

  const openLogout = useCallback(() => {
    triggerLightHaptic();
    setLogoutVisible(true);
  }, []);

  const closeLogout = useCallback(() => {
    setLogoutVisible(false);
  }, []);

  const confirmLogout = useCallback(() => {
    triggerLightHaptic();
    setLogoutVisible(false);
    authSession.clear();
    router.replace(ROUTES.welcome);
  }, [router]);

  return {
    profile,
    menuItems: PROFILE_MENU_ITEMS,
    uploadSheetVisible,
    logoutVisible,
    openCameraSheet,
    closeCameraSheet,
    applyAvatar,
    goBack,
    openSettings,
    openAddRedeem,
    openPaymentMethods,
    onMenuPress,
    openLogout,
    closeLogout,
    confirmLogout,
  };
};
