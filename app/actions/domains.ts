'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { DomainResponse, CreateDomainRequest } from '@/lib/api/domains';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface DomainActionResult extends ActionResult {
  domain?: DomainResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Create a new domain
 */
export async function createDomain(data: CreateDomainRequest): Promise<DomainActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to add domain' };
    }

    const json = await response.json();
    const domain: DomainResponse = json.data ?? json;

    revalidateTag('domains', 'max');
    revalidateTag('keywords', 'max');

    return { success: true, domain };
  } catch (error) {
    console.error('Create domain error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing domain
 */
export async function updateDomain(id: number, data: Partial<CreateDomainRequest>): Promise<DomainActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to update domain' };
    }

    const json = await response.json();
    const domain: DomainResponse = json.data ?? json;

    revalidateTag('domains', 'max');
    revalidateTag('keywords', 'max');

    return { success: true, domain };
  } catch (error) {
    console.error('Update domain error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a domain
 */
export async function deleteDomain(id: number): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to delete domain' };
    }

    revalidateTag('domains', 'max');
    revalidateTag('keywords', 'max');
    revalidateTag('dashboard', 'max');

    return { success: true };
  } catch (error) {
    console.error('Delete domain error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
