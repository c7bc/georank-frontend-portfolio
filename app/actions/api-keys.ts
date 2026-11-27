'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { CreateAPIKeyRequest, APIKeyCreatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface APIKeyActionResult extends ActionResult {
  apiKey?: APIKeyCreatedResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new API key
 * @returns The full API key (only shown once on creation)
 */
export async function createAPIKey(data: CreateAPIKeyRequest): Promise<APIKeyActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to create API key' };
    }

    const json = await response.json();
    const apiKey: APIKeyCreatedResponse = json.data ?? json;

    revalidateTag('api-keys', 'max');

    return { success: true, apiKey };
  } catch (error) {
    console.error('Create API key error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete an API key
 */
export async function deleteAPIKey(id: number): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to delete API key' };
    }

    revalidateTag('api-keys', 'max');

    return { success: true };
  } catch (error) {
    console.error('Delete API key error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
