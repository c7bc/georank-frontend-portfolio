'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { CreateCompetitorRequest, CompetitorResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface CompetitorActionResult extends ActionResult {
  competitor?: CompetitorResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new competitor
 */
export async function createCompetitor(data: CreateCompetitorRequest): Promise<CompetitorActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/competitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to add competitor' };
    }

    const json = await response.json();
    const competitor: CompetitorResponse = json.data ?? json;

    revalidateTag('competitors', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true, competitor };
  } catch (error) {
    console.error('Create competitor error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a competitor
 */
export async function deleteCompetitor(id: number): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/competitors/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to remove competitor' };
    }

    revalidateTag('competitors', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true };
  } catch (error) {
    console.error('Delete competitor error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
