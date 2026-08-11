import { useCallback, useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { useRouter } from 'expo-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ROUTES } from '@/config';
import {
  demoUsersStore,
  mapGenderToDemo,
  userDetailsSheetSync,
} from '@/DemoData';
import { getErrorMessage, triggerSuccessHaptic } from '@/shared/utils';
import { authSession, showAppAlert } from '@/store';
import { aadhaarVerificationStore } from '@/features/profile/store';
import { authService } from '../services';
import { profileSetupDraft } from '../store';
import { profileValidationSchema, type ProfileFormValues } from '../validation';


export interface UseCompleteProfileResult {
  form: UseFormReturn<ProfileFormValues>;
  avatarUri: string | null;
  setAvatarUri: (uri: string) => void;
  loading: boolean;
  isIdentityVerified: boolean;
  saveDraft: () => void;
  submit: () => void;
}

export const useCompleteProfile = (): UseCompleteProfileResult => {
  const router = useRouter();
  const initialDraft = profileSetupDraft.get();
  const [avatarUri, setAvatarUriState] = useState<string | null>(initialDraft.avatarUri);
  const [loading, setLoading] = useState(false);
  const [isIdentityVerified, setIsIdentityVerified] = useState(
    () => aadhaarVerificationStore.get() != null,
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileValidationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: initialDraft.fullName,
      email: initialDraft.email,
      gender: initialDraft.gender,
    },
  });

  const setAvatarUri = useCallback((uri: string) => {
    setAvatarUriState(uri);
    profileSetupDraft.set({ avatarUri: uri });
  }, []);

  const saveDraft = useCallback(() => {
    const values = form.getValues();
    profileSetupDraft.set({
      fullName: values.fullName ?? '',
      email: values.email ?? '',
      gender: values.gender,
      avatarUri,
    });
  }, [avatarUri, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      profileSetupDraft.set({
        fullName: values.fullName ?? '',
        email: values.email ?? '',
        gender: values.gender,
        avatarUri,
      });
    });
    return () => subscription.unsubscribe();
  }, [avatarUri, form]);

  useEffect(() => aadhaarVerificationStore.subscribe((record) => {
    setIsIdentityVerified(record != null);
  }), []);

  useEffect(() => {
    if (!initialDraft.promptFillDetails) {
      return;
    }

    profileSetupDraft.setPromptFillDetails(false);
    showAppAlert(
      'Complete your profile',
      'Identity verified. Please fill in your required details to continue.',
    );
  }, [initialDraft.promptFillDetails]);

  const submit = useCallback(() => {
    void form.handleSubmit(async (values) => {
      Keyboard.dismiss();
      setLoading(true);

      try {
        const sessionUserBefore = authSession.getUser();
        const aadhaar = aadhaarVerificationStore.get();

        // 2-way sheet: validate against Google Sheet, then insert/update local + remote.
        const cloudinaryAvatar =
          avatarUri && /^https?:\/\//i.test(avatarUri) ? avatarUri : undefined;

        await userDetailsSheetSync.validateAndSync({
          userName: values.fullName.trim(),
          email: values.email.trim(),
          aadharNumber: aadhaar?.maskedAadhaar ?? '',
          mobile: sessionUserBefore?.phone ?? '',
          profilePicture: cloudinaryAvatar,
          role: 'Both',
        });

        const profile = await authService.completeProfile({
          ...values,
          avatarUri: cloudinaryAvatar ?? avatarUri,
        });
        triggerSuccessHaptic();
        authSession.setUserFromProfile(profile);

        const sessionUser = authSession.getUser();
        await demoUsersStore.add({
          full_name: profile.fullName,
          email: profile.email,
          mobile: sessionUser?.phone ?? '',
          profile_image: cloudinaryAvatar ?? profile.avatarUri ?? '',
          gender: mapGenderToDemo(profile.gender),
          role: 'both',
          is_verified: aadhaar != null,
        });

        profileSetupDraft.clear();
        router.replace(ROUTES.home);
      } catch (error) {
        showAppAlert('Unable to save profile', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    })();
  }, [avatarUri, form, router]);

  return {
    form,
    avatarUri,
    setAvatarUri,
    loading,
    isIdentityVerified,
    saveDraft,
    submit,
  };
};
