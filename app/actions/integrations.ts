'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { IntegrationType, IntegrationResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface IntegrationActionResult extends ActionResult {
  integration?: IntegrationResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Toggle integration on/off
 */
export async function toggleIntegration(
  type: IntegrationType,
  enabled: boolean
): Promise<IntegrationActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/integrations/${type}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify({ enabled }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to toggle integration' };
    }

    const json = await response.json();
    const integration: IntegrationResponse = json.data ?? json;

    revalidateTag('integrations', 'max');

    return { success: true, integration };
  } catch (error) {
    console.error('Toggle integration error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function saveIntegrationConfig(
  type: IntegrationType,
  webhookUrl: string,
  secret?: string
): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();
    const body: Record<string, string> = { webhook_url: webhookUrl };
    if (secret) body.secret = secret;

    const response = await fetch(`${API_BASE_URL}/integrations/${type}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to save configuration' };
    }

    revalidateTag('integrations', 'max');
    return { success: true };
  } catch (error) {
    console.error('Save integration config error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function testIntegrationConnection(
  type: IntegrationType
): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/integrations/${type}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Test failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Test integration error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
