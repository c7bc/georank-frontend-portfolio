'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type {
  GenerateReportRequest,
  ReportResponse,
  ReportSettingsRequest,
  ReportSettingsResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ActionResult {
  success: boolean;
  error?: string;
}

interface ReportActionResult extends ActionResult {
  report?: ReportResponse;
}

interface SettingsActionResult extends ActionResult {
  settings?: ReportSettingsResponse;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Generate a new report
 */
export async function generateReport(data: GenerateReportRequest): Promise<ReportActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || 'Failed to generate report' };
    }

    const json = await response.json();
    const report: ReportResponse = json.data ?? json;

    revalidateTag('reports', 'max');

    return { success: true, report };
  } catch (error) {
    console.error('Generate report error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update report settings
 */
export async function updateReportSettings(data: ReportSettingsRequest): Promise<SettingsActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/reports/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || 'Failed to update settings' };
    }

    const json = await response.json();
    const settings: ReportSettingsResponse = json.data ?? json;

    revalidateTag('report-settings', 'max');

    return { success: true, settings };
  } catch (error) {
    console.error('Update report settings error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Update report recipients
 */
export async function updateReportRecipients(data: { recipients: string[] }): Promise<ActionResult> {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/reports/recipients`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData?.error?.message || 'Failed to update recipients' };
    }

    revalidateTag('report-settings', 'max');

    return { success: true };
  } catch (error) {
    console.error('Update recipients error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
