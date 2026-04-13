import { apiClient } from '@/shared/api/client';
import type { InvoiceStatus } from '@/features/invoices/api/invoices.api';

export type InvoiceStatusBreakdown = {
  status: InvoiceStatus;
  count: number;
  totalAmount: string;
};

export type FinanceSummary = {
  invoicesByStatus: InvoiceStatusBreakdown[];
  paymentsTotal: string;
  expensesTotal: string;
  netCashflow: string;
};

export type FinanceSummaryParams = {
  from?: string;
  to?: string;
};

function queryString(params?: FinanceSummaryParams): string {
  const q = new URLSearchParams();
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const financeAnalyticsApi = {
  summary: (params?: FinanceSummaryParams) =>
    apiClient.get<FinanceSummary>(`/finance/analytics/summary${queryString(params)}`),
};
