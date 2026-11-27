'use server';

import { revalidateTag } from 'next/cache';
import { apiFetch } from '@/lib/api/client';
import { domainsApi, keywordsApi, competitorsApi } from '@/lib/api';
import type { PlanResponse } from '@/types';
import type { DomainListResponse } from '@/lib/api/domains';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface OnboardingState {
  initialStep: number;
  keywordLimit: number;
  competitorLimit: number;
  competitorsEnabled: boolean;
}

/**
 * Detect onboarding progress and plan limits.
 * Uses apiFetch directly (no cache options) since server actions don't support next.revalidate.
 */
export async function getOnboardingState(): Promise<OnboardingState> {
  const defaults: OnboardingState = { initialStep: 1, keywordLimit: 3, competitorLimit: 2, competitorsEnabled: false };

  try {
    const [plan, domains, keywords] = await Promise.allSettled([
      apiFetch<PlanResponse>('/billing/plan'),
      apiFetch<unknown>('/domains?page=1&per_page=1'),
      apiFetch<{ keywords: unknown[]; total: number }>('/keywords?page=1&per_page=1'),
    ]);

    const keywordLimit = plan.status === 'fulfilled' ? (plan.value.keyword_limit ?? 3) : 3;
    const competitorLimit = plan.status === 'fulfilled' ? (plan.value.competitor_limit ?? 2) : 2;
    const competitorsEnabled = plan.status === 'fulfilled' ? (plan.value.competitors_enabled ?? false) : false;

    let hasDomains = false;
    if (domains.status === 'fulfilled') {
      const d = domains.value;
      hasDomains = Array.isArray(d) ? d.length > 0 : !!(d && typeof d === 'object' && 'total' in d && typeof d.total === 'number' && d.total > 0);
    }

    const hasKeywords = keywords.status === 'fulfilled' && keywords.value.total > 0;

    let initialStep = 1;
    if (hasDomains && hasKeywords) {
      initialStep = competitorsEnabled ? 3 : 4;
    } else if (hasDomains) {
      initialStep = 2;
    }

    return { initialStep, keywordLimit, competitorLimit, competitorsEnabled };
  } catch {
    return defaults;
  }
}

/**
 * Submit domain during onboarding
 */
export async function submitOnboardingDomain(
  domain: string
): Promise<ActionResult> {
  try {
    if (!domain || domain.trim().length === 0) {
      return { success: false, error: 'Domain is required' };
    }

    await domainsApi.create({
      url: domain.trim(),
      name: domain.trim(),
    });

    revalidateTag('domains', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true };
  } catch (error) {
    console.error('Onboarding domain submission error:', error);

    return { success: false, error: error instanceof Error ? error.message : 'Failed to add domain' };
  }
}

/**
 * Submit keywords during onboarding
 */
export async function submitOnboardingKeywords(
  keywords: string[]
): Promise<ActionResult> {
  try {
    if (!keywords || keywords.length === 0) {
      return { success: false, error: 'At least one keyword is required' };
    }

    // Filter out empty strings
    const validKeywords = keywords.filter((k) => k.trim().length > 0);

    if (validKeywords.length === 0) {
      return { success: false, error: 'At least one keyword is required' };
    }

    // Fetch domains to auto-assign domain_id
    let domainId: number | undefined;
    try {
      const domainsRes = await domainsApi.list();
      const items = Array.isArray(domainsRes) ? domainsRes : (domainsRes as DomainListResponse).items ?? [];
      if (items.length > 0) {
        domainId = items[0].id;
      }
    } catch {
      // Continue without domain_id if fetch fails
    }

    // Create keywords one by one
    for (const keyword of validKeywords) {
      await keywordsApi.create({
        keyword: keyword.trim(),
        category: 'onboarding',
        domain_id: domainId,
      });
    }

    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');
    revalidateTag('billing', 'max');

    return { success: true };
  } catch (error) {
    console.error('Onboarding keywords submission error:', error);

    return { success: false, error: error instanceof Error ? error.message : 'Failed to add keywords' };
  }
}

/**
 * Submit competitors during onboarding
 */
export async function submitOnboardingCompetitors(
  competitors: string[]
): Promise<ActionResult> {
  try {
    if (!competitors || competitors.length === 0) {
      return { success: true }; // Competitors are optional
    }

    // Filter out empty strings
    const validCompetitors = competitors.filter((c) => c.trim().length > 0);

    if (validCompetitors.length === 0) {
      return { success: true }; // No competitors to add
    }

    // Create competitors one by one
    for (const competitor of validCompetitors) {
      const domain = competitor.trim();
      await competitorsApi.create({
        domain,
        name: domain, // Use domain as name if not provided
      });
    }

    revalidateTag('competitors', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true };
  } catch (error) {
    console.error('Onboarding competitors submission error:', error);

    return { success: false, error: error instanceof Error ? error.message : 'Failed to add competitors' };
  }
}
