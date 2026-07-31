export const ADD_BANK_ACCOUNT_SCREEN = {
  brandTitle: 'BhaiWay',
  title: 'Add Bank Account',
  subtitle: 'Securely link your bank account for seamless withdrawals and payments.',
  privacyTitle: 'Banking Privacy',
  privacyBody:
    'Your banking details are encrypted and stored following industry-leading security standards. We never share your transaction data.',
  holderNameLabel: 'Account Holder Name',
  holderNamePlaceholder: 'e.g. Johnathan Doe',
  bankNameLabel: 'Bank Name',
  bankNamePlaceholder: 'e.g. Federal Reserve Bank',
  accountNumberLabel: 'Account Number',
  accountNumberPlaceholder: '•••• •••• ••••',
  ifscLabel: 'IFSC Code',
  ifscPlaceholder: 'ABCD0123456',
  findLabel: 'FIND',
  infoNote: 'All transfers are processed within 24-48 working hours.',
  submitLabel: 'Save Bank Account',
  submittingLabel: 'Saving…',
  successLabel: 'Success!',
  validationTitle: 'Missing Details',
  validationMessage: 'Please fill in all bank account fields to continue.',
  invalidIfscTitle: 'Invalid IFSC',
  invalidIfscMessage: 'Enter a valid 11-character IFSC code (e.g. HDFC0001234).',
  findTitle: 'Find IFSC',
  findMessage: 'Bank branch lookup will be available soon.',
} as const;

export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
