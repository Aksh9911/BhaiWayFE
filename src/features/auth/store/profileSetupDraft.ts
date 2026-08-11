import type { Gender } from '../types';
import { profileValidationSchema } from '../validation';

export interface ProfileSetupDraft {
  fullName: string;
  email: string;
  gender?: Gender;
  avatarUri: string | null;
  /** Show fill-details alert when returning from Aadhaar without a complete profile. */
  promptFillDetails: boolean;
}

type DraftListener = (draft: ProfileSetupDraft) => void;

const EMPTY_DRAFT: ProfileSetupDraft = {
  fullName: '',
  email: '',
  avatarUri: null,
  promptFillDetails: false,
};

let draft: ProfileSetupDraft = { ...EMPTY_DRAFT };
const listeners = new Set<DraftListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener({ ...draft }));
};

export const isProfileSetupDraftComplete = (
  value: Pick<ProfileSetupDraft, 'fullName' | 'email' | 'gender'> = draft,
): boolean => profileValidationSchema.safeParse(value).success;

export const profileSetupDraft = {
  get: (): ProfileSetupDraft => ({ ...draft }),

  set: (next: Partial<ProfileSetupDraft>): void => {
    draft = { ...draft, ...next };
    notify();
  },

  setPromptFillDetails: (promptFillDetails: boolean): void => {
    draft = { ...draft, promptFillDetails };
    notify();
  },

  clear: (): void => {
    draft = { ...EMPTY_DRAFT };
    notify();
  },

  subscribe: (listener: DraftListener): (() => void) => {
    listeners.add(listener);
    listener({ ...draft });
    return () => {
      listeners.delete(listener);
    };
  },
};
