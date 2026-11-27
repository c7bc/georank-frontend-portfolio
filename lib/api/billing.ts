import { api } from './client';
import type {
  PlanResponse,
  PlanDetails,
  UsageResponse,
  InvoiceListResponse,
  PaginationParams,
  CheckoutResponse,
  PortalResponse,
  DowngradeImpact,
} from '@/types';

/**
 * Billing API - Plan, usage, and invoices
 */
export const billingApi = {
  /**
   * Get current plan information
   */
  async getPlan(): Promise<PlanResponse> {
    return api.get<PlanResponse>('/billing/plan', {
      next: { revalidate: 3600, tags: ['billing', 'plan'] },
    });
  },

  /**
   * Get current usage statistics
   */
  async getUsage(): Promise<UsageResponse> {
    return api.get<UsageResponse>('/billing/usage', {
      next: { revalidate: 60, tags: ['billing', 'usage'] },
    });
  },

  /**
   * Get all available plans
   */
  async getPlans(): Promise<PlanDetails[]> {
    return api.get<PlanDetails[]>('/billing/plans', {
      next: { revalidate: 3600, tags: ['billing', 'plans'] },
      skipAuth: true,
    });
  },

  /**
   * Create a Stripe checkout session
   */
  async createCheckout(plan: string, successUrl: string, cancelUrl: string): Promise<CheckoutResponse> {
    return api.post<CheckoutResponse>('/billing/checkout', {
      plan,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  },

  /**
   * Create a Stripe customer portal session
   */
  async createPortal(returnUrl: string): Promise<PortalResponse> {
    return api.post<PortalResponse>('/billing/portal', {
      return_url: returnUrl,
    });
  },

  /**
   * Preview impact of downgrading to a different plan
   */
  async downgradePreview(plan: string): Promise<DowngradeImpact> {
    return api.get<DowngradeImpact>(`/billing/downgrade-preview?plan=${plan}`);
  },

  /**
   * List invoices with pagination
   */
  async listInvoices(params?: PaginationParams): Promise<InvoiceListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));

    const query = searchParams.toString();
    return api.get<InvoiceListResponse>(`/billing/invoices${query ? `?${query}` : ''}`, {
      next: { revalidate: 300, tags: ['billing', 'invoices'] },
    });
  },
};
