'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type {
  SchedulingResponse,
  UpdateReportSchedulingRequest,
  UpdateRecommendationSchedulingRequest,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
  scheduling?: SchedulingResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Update report scheduling settings (auto_generate, send_email)
 */
export async function updateReportScheduling(data: UpdateReportSchedulingRequest): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/scheduling/reports`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || 'Failed to update report scheduling' };
    }

    const json = await response.json();
    const scheduling: SchedulingResponse = json.data ?? json;

    revalidateTag('scheduling', 'max');
    revalidateTag('report-settings', 'max');

    return { success: true, scheduling };
  } catch (error) {
    console.error('Update report scheduling error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update recommendation scheduling settings (auto_generate)
 */
export async function updateRecommendationScheduling(data: UpdateRecommendationSchedulingRequest): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/scheduling/recommendations`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || 'Failed to update recommendation scheduling' };
    }

    const json = await response.json();
    const scheduling: SchedulingResponse = json.data ?? json;

    revalidateTag('scheduling', 'max');

    return { success: true, scheduling };
  } catch (error) {
    console.error('Update recommendation scheduling error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
