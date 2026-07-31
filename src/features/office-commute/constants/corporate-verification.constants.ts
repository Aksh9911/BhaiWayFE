export const CORPORATE_VERIFICATION_SCREEN = {
  title: 'Corporate Verification',
  officeDetailsTitle: 'Office Details',
  idVerificationTitle: 'ID Verification',
  companyLabel: 'Company Name',
  companyPlaceholder: 'e.g. Acme Corporation',
  emailLabel: 'Work Email Address',
  emailPlaceholder: 'name@company.com',
  uploadTitle: 'Corporate ID Card Photo',
  uploadSubtitle: 'Front view of your employee identification card.',
  uploadHint: 'Ensure all details are clearly visible',
  uploadingLabel: 'Processing ID...',
  uploadedLabel: 'ID Uploaded Successfully',
  uploadSheetTitle: 'Upload Corporate ID',
  uploadSheetSubtitle: 'Take a clear photo or choose one from your gallery.',
  backOptionalLabel: 'Back View (Optional)',
  securityTitle: 'Data Security Commitment',
  securityBody: 'Your ID is only used for verification and is never shared.',
  submitLabel: 'Submit for Verification',
  submittingLabel: 'Submitting...',
  successTitle: 'Submitted',
  successMessage:
    'Your corporate ID has been submitted for verification. We’ll notify you once it’s reviewed.',
} as const;

export const WORK_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
