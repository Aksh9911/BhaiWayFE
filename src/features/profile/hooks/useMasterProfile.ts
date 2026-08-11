import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  findCurrentUserSheetRow,
  formatBhaiWayWalletLabel,
  getBhaiWayWalletBalance,
  subscribeBhaiWayWallet,
} from '@/DemoData';
import { saveProfilePhotoUrl } from '@/features/media';
import { useUpload } from '@/hooks/useUpload';
import type { UploadedDocument } from '@/shared/components';
import { useSessionUser } from '@/shared/hooks';
import { formatPhoneNumber, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { authSession, showAppAlert } from '@/store';
import {
  DEFAULT_MASTER_PROFILE,
  DEFAULT_PROFILE_AVATAR,
  canAccessLocalDemoData,
  PROFILE_MENU_ITEMS,
  PROFILE_SCREEN,
} from '../constants';
import { corporateVerificationStore } from '@/features/office-commute/store';
import type {
  MasterProfileData,
  ProfileMenuActionId,
  ProfileMenuItem,
} from '../types';

/** Snapshot so profile name/phone refresh when the sheet row changes. */
const getSheetProfileIdentity = (): string => {
  const row = findCurrentUserSheetRow();
  return [
    row?.userName ?? '',
    row?.mobile ?? '',
    row?.profilePicture ?? '',
    String(row?.bhaiWayWallet ?? 0),
    String(getBhaiWayWalletBalance()),
  ].join('|');
};

const formatProfilePhoneLabel = (mobile?: string | null, fallback?: string | null): string => {
  const digits = (mobile ?? fallback ?? '').replace(/\D/g, '').slice(-10);
  if (digits.length === 10) {
    return `+91 ${formatPhoneNumber(digits)}`;
  }
  const trimmed = (mobile ?? fallback ?? '').trim();
  return trimmed || DEFAULT_MASTER_PROFILE.phoneLabel;
};

export interface UseMasterProfileResult {
  profile: MasterProfileData;
  menuItems: readonly ProfileMenuItem[];
  showDemoDataSettings: boolean;
  uploadSheetVisible: boolean;
  avatarUploading: boolean;
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
  const sheetIdentity = useSyncExternalStore(subscribeBhaiWayWallet, getSheetProfileIdentity);
  const sheetRow = useMemo(() => findCurrentUserSheetRow(), [sheetIdentity]);
  const walletBalanceLabel = formatBhaiWayWalletLabel(getBhaiWayWalletBalance());
  const canOpenDemoData = canAccessLocalDemoData(sheetRow?.mobile || user?.phone);
  const menuItems = useMemo(
    () =>
      canOpenDemoData
        ? PROFILE_MENU_ITEMS
        : PROFILE_MENU_ITEMS.filter((item) => item.id !== 'demoData'),
    [canOpenDemoData],
  );
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [isCorporateVerified, setIsCorporateVerified] = useState(() =>
    corporateVerificationStore.isVerified(),
  );
  const uploadGenerationRef = useRef(0);

  const { uploadLocalFile, isUploading: avatarUploading, cancelUpload } = useUpload({
    kind: 'profile',
    onUploaded: saveProfilePhotoUrl,
    showAlerts: true,
  });

  useEffect(
    () =>
      corporateVerificationStore.subscribe((record) => {
        setIsCorporateVerified(record != null);
      }),
    [],
  );

  useEffect(
    () => () => {
      cancelUpload();
    },
    [cancelUpload],
  );

  const profile = useMemo((): MasterProfileData => {
    const fullName =
      sheetRow?.userName?.trim() ||
      user?.fullName?.trim() ||
      DEFAULT_MASTER_PROFILE.fullName;
    const phoneLabel = formatProfilePhoneLabel(sheetRow?.mobile, user?.phone);
    const avatarUri =
      localAvatarUri ??
      (sheetRow?.profilePicture?.trim() ||
        user?.avatarUri ||
        DEFAULT_MASTER_PROFILE.avatarUri ||
        DEFAULT_PROFILE_AVATAR);
    const ratingLabel = '0';

    const badges = [
      isCorporateVerified
        ? {
            id: 'corporate',
            label: 'Corporate ID',
            icon: 'verified' as const,
            tone: 'success' as const,
          }
        : {
            id: 'corporate',
            label: 'Corporate ID',
            icon: 'close-circle' as const,
            tone: 'danger' as const,
          },
      { id: 'rating', label: ratingLabel, icon: 'star' as const, tone: 'neutral' as const },
      {
        id: 'trust',
        label: DEFAULT_MASTER_PROFILE.trustLabel,
        icon: 'shield-checkmark' as const,
        tone: 'primary' as const,
      },
    ];

    return {
      ...DEFAULT_MASTER_PROFILE,
      fullName,
      phoneLabel,
      avatarUri,
      walletBalanceLabel,
      ratingLabel,
      badges,
    };
  }, [
    isCorporateVerified,
    localAvatarUri,
    sheetRow?.mobile,
    sheetRow?.profilePicture,
    sheetRow?.userName,
    user?.avatarUri,
    user?.fullName,
    user?.phone,
    walletBalanceLabel,
  ]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  const openSettings = useCallback(() => {
    triggerLightHaptic();
    if (!canAccessLocalDemoData(findCurrentUserSheetRow()?.mobile || authSession.getUser()?.phone)) {
      showAppAlert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
      return;
    }
    router.push(ROUTES.demoData);
  }, [router]);

  const openCameraSheet = useCallback(() => {
    triggerLightHaptic();
    // Allow reopening even if a previous upload is in flight.
    setUploadSheetVisible(true);
  }, []);

  const closeCameraSheet = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyAvatar = useCallback(
    (document: UploadedDocument) => {
      const generation = ++uploadGenerationRef.current;
      setLocalAvatarUri(document.uri);

      void (async () => {
        const uploaded = await uploadLocalFile({
          uri: document.uri,
          fileName: document.fileName ?? `profile_${Date.now()}.jpg`,
          mimeType: document.mimeType ?? 'image/jpeg',
        });

        if (generation !== uploadGenerationRef.current) {
          return;
        }

        if (!uploaded) {
          // Revert optimistic preview if Cloudinary failed / cancelled.
          setLocalAvatarUri(null);
          return;
        }

        setLocalAvatarUri(uploaded.secureUrl);
        const current = authSession.getUser();
        if (current) {
          authSession.setSession(authSession.getToken() ?? '', {
            ...current,
            avatarUri: uploaded.secureUrl,
          });
        }

        // UserDetails sheet sync happens in saveProfilePhotoUrl (onUploaded).
        triggerSuccessHaptic();
      })();
    },
    [uploadLocalFile],
  );

  const openAddRedeem = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.wallet);
  }, [router]);

  const openPaymentMethods = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
  }, []);

  const onMenuPress = useCallback(
    (id: ProfileMenuActionId) => {
      triggerLightHaptic();

      if (id === 'verify') {
        router.push(ROUTES.verifyAadhaar);
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

      if (id === 'demoData') {
        if (
          !canAccessLocalDemoData(
            findCurrentUserSheetRow()?.mobile || authSession.getUser()?.phone,
          )
        ) {
          showAppAlert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
          return;
        }
        router.push(ROUTES.demoData);
        return;
      }

      showAppAlert(PROFILE_SCREEN.comingSoonTitle, PROFILE_SCREEN.comingSoonMessage);
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
    menuItems,
    showDemoDataSettings: canOpenDemoData,
    uploadSheetVisible,
    avatarUploading,
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
