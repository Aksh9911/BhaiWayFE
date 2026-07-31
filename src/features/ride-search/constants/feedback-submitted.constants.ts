export const FEEDBACK_SUBMITTED_SCREEN = {
  heading: 'Thank You!',
  subtitle:
    "Your feedback helps maintain BhaiWay's professional standards. Your payment has been processed successfully.",
  goHomeLabel: 'Go to Home',
  viewReceiptLabel: 'VIEW RECEIPT',
  paymentMethodLabel: 'Payment Method',
  paymentMethodValue: 'Visa ending in 4242',
  ratingLabel: 'Your Rating',
  receiptTitle: 'Receipt',
  receiptMessage: 'Your trip receipt will be available soon.',
} as const;

export const getFeedbackSubmittedPath = (params?: { rating?: number }) => ({
  pathname: '/ride-search/feedback-submitted' as const,
  params: {
    rating: params?.rating != null ? String(params.rating) : '5',
  },
});
