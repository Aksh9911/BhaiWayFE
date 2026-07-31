import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { UploadedDocument } from '@/shared/components';
import {
  delay,
  generateId,
  getSearchParam,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import {
  CONTACT_RELATIONS,
  EDIT_CONTACT_SCREEN,
} from '../constants/edit-contact.constants';
import { trustedContactsStore } from '../store';
import type {
  ContactFormMode,
  ContactRelation,
  EditContactForm,
  EditContactSubmitState,
} from '../types';

const isRelation = (value: string): value is ContactRelation =>
  (CONTACT_RELATIONS as readonly string[]).includes(value);

export interface UseEditContactResult {
  mode: ContactFormMode;
  title: string;
  subtitle: string;
  form: EditContactForm;
  relations: readonly ContactRelation[];
  submitState: EditContactSubmitState;
  uploadSheetVisible: boolean;
  saveLabel: string;
  setName: (value: string) => void;
  setRelation: (value: ContactRelation) => void;
  setPhone: (value: string) => void;
  openUpload: () => void;
  closeUpload: () => void;
  applyAvatar: (document: UploadedDocument) => void;
  save: () => Promise<void>;
  deleteContact: () => void;
  goBack: () => void;
}

export const useEditContact = (): UseEditContactResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; id?: string }>();
  const mode: ContactFormMode =
    getSearchParam(params.mode) === 'edit' ? 'edit' : 'add';
  const contactId = getSearchParam(params.id);

  const existing = useMemo(
    () => (contactId ? trustedContactsStore.getById(contactId) : undefined),
    [contactId],
  );

  const [form, setForm] = useState<EditContactForm>(() => {
    if (mode === 'edit' && existing) {
      return {
        id: existing.id,
        name: existing.name,
        relation: isRelation(existing.relation) ? existing.relation : 'Other',
        phoneLabel: existing.phoneLabel,
        avatarUri: existing.avatarUri ?? null,
      };
    }
    return {
      id: null,
      name: '',
      relation: 'Friend',
      phoneLabel: '',
      avatarUri: EDIT_CONTACT_SCREEN.defaultAvatarUri,
    };
  });

  const [submitState, setSubmitState] = useState<EditContactSubmitState>('idle');
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setForm({
        id: existing.id,
        name: existing.name,
        relation: isRelation(existing.relation) ? existing.relation : 'Other',
        phoneLabel: existing.phoneLabel,
        avatarUri: existing.avatarUri ?? null,
      });
    }
  }, [existing, mode]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.trustedContacts);
  }, [router]);

  const setName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
  }, []);

  const setRelation = useCallback((value: ContactRelation) => {
    setForm((prev) => ({ ...prev, relation: value }));
  }, []);

  const setPhone = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, phoneLabel: value }));
  }, []);

  const openUpload = useCallback(() => {
    triggerLightHaptic();
    setUploadSheetVisible(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyAvatar = useCallback((document: UploadedDocument) => {
    setForm((prev) => ({ ...prev, avatarUri: document.uri }));
  }, []);

  const save = useCallback(async () => {
    if (submitState !== 'idle') {
      return;
    }

    triggerLightHaptic();
    const name = form.name.trim();
    const phoneLabel = form.phoneLabel.trim();

    if (!name || !phoneLabel) {
      Alert.alert(EDIT_CONTACT_SCREEN.validationTitle, EDIT_CONTACT_SCREEN.validationMessage);
      return;
    }

    setSubmitState('submitting');
    await delay(900);

    trustedContactsStore.upsert({
      id: form.id ?? generateId('contact'),
      name,
      relation: form.relation,
      phoneLabel,
      avatarUri: form.avatarUri ?? undefined,
    });

    setSubmitState('success');
    triggerSuccessHaptic();
    await delay(700);
    setSubmitState('idle');
    goBack();
  }, [form, goBack, submitState]);

  const deleteContact = useCallback(() => {
    if (!form.id) {
      return;
    }
    triggerLightHaptic();
    Alert.alert(
      EDIT_CONTACT_SCREEN.deleteTitle,
      EDIT_CONTACT_SCREEN.deleteMessage(form.name || 'this contact'),
      [
        { text: EDIT_CONTACT_SCREEN.deleteCancel, style: 'cancel' },
        {
          text: EDIT_CONTACT_SCREEN.deleteConfirm,
          style: 'destructive',
          onPress: () => {
            if (form.id) {
              trustedContactsStore.remove(form.id);
            }
            triggerSuccessHaptic();
            goBack();
          },
        },
      ],
    );
  }, [form.id, form.name, goBack]);

  return {
    mode,
    title: mode === 'edit' ? EDIT_CONTACT_SCREEN.editTitle : EDIT_CONTACT_SCREEN.addTitle,
    subtitle: mode === 'edit' ? EDIT_CONTACT_SCREEN.subtitle : EDIT_CONTACT_SCREEN.addSubtitle,
    form,
    relations: CONTACT_RELATIONS,
    submitState,
    uploadSheetVisible,
    saveLabel:
      mode === 'edit' ? EDIT_CONTACT_SCREEN.saveLabel : EDIT_CONTACT_SCREEN.addSaveLabel,
    setName,
    setRelation,
    setPhone,
    openUpload,
    closeUpload,
    applyAvatar,
    save,
    deleteContact,
    goBack,
  };
};
