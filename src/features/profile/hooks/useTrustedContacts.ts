import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { TRUSTED_CONTACTS_SCREEN } from '../constants';
import { trustedContactsStore } from '../store';
import type { TrustedContact } from '../types';

export interface UseTrustedContactsResult {
  contacts: TrustedContact[];
  goBack: () => void;
  openProfile: () => void;
  editContact: (contact: TrustedContact) => void;
  deleteContact: (contact: TrustedContact) => void;
  callContact: (contact: TrustedContact) => void;
  addContact: () => void;
}

export const useTrustedContacts = (): UseTrustedContactsResult => {
  const router = useRouter();
  const [contacts, setContacts] = useState<TrustedContact[]>(trustedContactsStore.get());

  useEffect(() => trustedContactsStore.subscribe(setContacts), []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.safetyHub);
  }, [router]);

  const openProfile = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.profile);
  }, [router]);

  const editContact = useCallback(
    (contact: TrustedContact) => {
      triggerLightHaptic();
      router.push({
        pathname: ROUTES.editContact,
        params: { mode: 'edit', id: contact.id },
      });
    },
    [router],
  );

  const deleteContact = useCallback((contact: TrustedContact) => {
    triggerLightHaptic();
    Alert.alert(
      TRUSTED_CONTACTS_SCREEN.deleteTitle,
      TRUSTED_CONTACTS_SCREEN.deleteMessage(contact.name),
      [
        { text: TRUSTED_CONTACTS_SCREEN.deleteCancel, style: 'cancel' },
        {
          text: TRUSTED_CONTACTS_SCREEN.deleteConfirm,
          style: 'destructive',
          onPress: () => {
            trustedContactsStore.remove(contact.id);
            triggerSuccessHaptic();
          },
        },
      ],
    );
  }, []);

  const callContact = useCallback((contact: TrustedContact) => {
    triggerLightHaptic();
    const digits = contact.phoneLabel.replace(/\D/g, '');
    Linking.openURL(`tel:${digits}`).catch(() => {
      Alert.alert(contact.name, contact.phoneLabel);
    });
  }, []);

  const addContact = useCallback(() => {
    triggerLightHaptic();
    router.push({
      pathname: ROUTES.editContact,
      params: { mode: 'add' },
    });
  }, [router]);

  return {
    contacts,
    goBack,
    openProfile,
    editContact,
    deleteContact,
    callContact,
    addContact,
  };
};
