import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, showAppAlert, triggerLightHaptic } from '@/shared/utils';
import { RIDE_INVOICE_SCREEN, getRideInvoiceMock, getReportIssuePath } from '../constants';
import type { RideInvoiceSummary } from '../types';

export interface UseRideInvoiceResult {
  invoice: RideInvoiceSummary;
  downloadPdf: () => void;
  reportIssue: () => void;
  openPaymentMethod: () => void;
  goBack: () => void;
}

export const useRideInvoice = (): UseRideInvoiceResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    dateLabel?: string;
  }>();

  const invoice = useMemo(
    () =>
      getRideInvoiceMock({
        rideId: getSearchParam(params.rideId) || undefined,
        pickupLabel: getSearchParam(params.pickupLabel) || undefined,
        dropoffLabel: getSearchParam(params.dropoffLabel) || undefined,
        dateLabel: getSearchParam(params.dateLabel) || undefined,
      }),
    [params.dateLabel, params.dropoffLabel, params.pickupLabel, params.rideId],
  );

  const downloadPdf = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(RIDE_INVOICE_SCREEN.downloadTitle, RIDE_INVOICE_SCREEN.downloadMessage);
  }, []);

  const reportIssue = useCallback(() => {
    triggerLightHaptic();
    router.push(
      getReportIssuePath({
        rideId: invoice.id,
        pickupLabel: invoice.pickupLabel,
        dropoffLabel: invoice.dropoffLabel,
        dateLabel: invoice.dateLabel,
      }),
    );
  }, [invoice.dateLabel, invoice.dropoffLabel, invoice.id, invoice.pickupLabel, router]);

  const openPaymentMethod = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.wallet);
  }, [router]);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    invoice,
    downloadPdf,
    reportIssue,
    openPaymentMethod,
    goBack,
  };
};
