import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { useSessionUser } from '@/shared/hooks';
import { delay, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import {
  ADD_BANK_ACCOUNT_SCREEN,
  IFSC_PATTERN,
} from '../constants/add-bank-account.constants';
import type {
  AddBankAccountForm,
  AddBankAccountSubmitState,
} from '../types';

const INITIAL_FORM: AddBankAccountForm = {
  holderName: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
};

export interface UseAddBankAccountResult {
  form: AddBankAccountForm;
  submitState: AddBankAccountSubmitState;
  avatarUri: string;
  setHolderName: (value: string) => void;
  setBankName: (value: string) => void;
  setAccountNumber: (value: string) => void;
  setIfsc: (value: string) => void;
  findIfsc: () => void;
  submit: () => Promise<void>;
  goBack: () => void;
  openProfile: () => void;
}

export const useAddBankAccount = (): UseAddBankAccountResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [form, setForm] = useState<AddBankAccountForm>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<AddBankAccountSubmitState>('idle');

  const avatarUri = useMemo(
    () => user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    [user?.avatarUri],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.withdraw);
  }, [router]);

  const openProfile = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.profile);
  }, [router]);

  const setHolderName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, holderName: value }));
  }, []);

  const setBankName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, bankName: value }));
  }, []);

  const setAccountNumber = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 18);
    setForm((prev) => ({ ...prev, accountNumber: cleaned }));
  }, []);

  const setIfsc = useCallback((value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
    setForm((prev) => ({ ...prev, ifsc: cleaned }));
  }, []);

  const findIfsc = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(ADD_BANK_ACCOUNT_SCREEN.findTitle, ADD_BANK_ACCOUNT_SCREEN.findMessage);
  }, []);

  const submit = useCallback(async () => {
    if (submitState !== 'idle') {
      return;
    }

    triggerLightHaptic();

    const holderName = form.holderName.trim();
    const bankName = form.bankName.trim();
    const accountNumber = form.accountNumber.trim();
    const ifsc = form.ifsc.trim().toUpperCase();

    if (!holderName || !bankName || !accountNumber || !ifsc) {
      Alert.alert(
        ADD_BANK_ACCOUNT_SCREEN.validationTitle,
        ADD_BANK_ACCOUNT_SCREEN.validationMessage,
      );
      return;
    }

    if (!IFSC_PATTERN.test(ifsc)) {
      Alert.alert(
        ADD_BANK_ACCOUNT_SCREEN.invalidIfscTitle,
        ADD_BANK_ACCOUNT_SCREEN.invalidIfscMessage,
      );
      return;
    }

    setSubmitState('submitting');
    await delay(2000);
    setSubmitState('success');
    triggerSuccessHaptic();
    await delay(800);

    const maskedNumber = `•••• ${accountNumber.slice(-4)}`;
    router.replace({
      pathname: ROUTES.bankAccountAdded,
      params: {
        kind: 'bank-account-added',
        bankName,
        maskedNumber,
      },
    });
  }, [form, router, submitState]);

  return {
    form,
    submitState,
    avatarUri,
    setHolderName,
    setBankName,
    setAccountNumber,
    setIfsc,
    findIfsc,
    submit,
    goBack,
    openProfile,
  };
};
