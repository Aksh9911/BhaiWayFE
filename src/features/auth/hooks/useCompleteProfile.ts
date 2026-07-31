import { useCallback, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ROUTES } from '@/config';
import { getErrorMessage, triggerSuccessHaptic } from '@/shared/utils';
import { authSession } from '@/store';
import { authService } from '../services';
import { profileValidationSchema, type ProfileFormValues } from '../validation';

export interface UseCompleteProfileResult {
  form: UseFormReturn<ProfileFormValues>;
  avatarUri: string | null;
  setAvatarUri: (uri: string) => void;
  loading: boolean;
  submit: () => void;
}

export const useCompleteProfile = (): UseCompleteProfileResult => {
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileValidationSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  const submit = useCallback(() => {
    void form.handleSubmit(async (values) => {
      Keyboard.dismiss();
      setLoading(true);

      try {
        const profile = await authService.completeProfile({ ...values, avatarUri });
        triggerSuccessHaptic();
        authSession.setUserFromProfile(profile);
        router.replace(ROUTES.home);
      } catch (error) {
        Alert.alert('Unable to save profile', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    })();
  }, [avatarUri, form]);

  return { form, avatarUri, setAvatarUri, loading, submit };
};
