'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { RecommendationStatus, RecommendationResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface RecommendationActionResult extends ActionResult {
  recommendation?: RecommendationResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generate recommendations (manual trigger)
 */
export async function generateRecommendations(): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/recommendations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || errorData?.message || 'Failed to generate recommendations' };
    }

    revalidateTag('recommendations', 'max');

    return { success: true };
  } catch (error) {
    console.error('Generate recommendations error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update recommendation status
 */
export async function updateRecommendationStatus(
  id: number,
  status: RecommendationStatus
): Promise<RecommendationActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/recommendations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update status' };
    }

    const json = await response.json();
    const recommendation: RecommendationResponse = json.data ?? json;

    revalidateTag('recommendations', 'max');

    return { success: true, recommendation };
  } catch (error) {
    console.error('Update recommendation status error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
