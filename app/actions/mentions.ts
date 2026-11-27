'use server';

import { api } from '@/lib/api/client';
import type { AIRecommendation, QueryInsight } from '@/types';

export async function getMentionRecommendations(
  mentionId: number
): Promise<{ success: boolean; data: AIRecommendation[]; error?: string }> {
  try {
    const data = await api.get<AIRecommendation[]>(
      `/mentions/${mentionId}/recommendations`,
      { cache: 'no-store' }
    );
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Get recommendations error:', error);
    return { success: false, data: [], error: 'Failed to load recommendations' };
  }
}

interface LatestMentionData {
  id: number;
  keyword_id: number;
  platform: string;
  result: string;
  position?: number | null;
  created_at: string;
  query: string;
}

export async function getLatestKeywordMention(
  keywordId: number
): Promise<{ success: boolean; data: LatestMentionData | null; error?: string }> {
  try {
    const data = await api.get<LatestMentionData>(
      `/keywords/${keywordId}/mentions/latest`,
      { cache: 'no-store' }
    );
    return { success: true, data };
  } catch (error) {
    console.error('Get latest mention error:', error);
    return { success: false, data: null, error: 'No mentions found' };
  }
}

interface MentionListItem {
  id: number;
  keyword_id: number;
  platform: string;
  query: string;
  result: string;
  position?: number | null;
  created_at: string;
}

export async function getKeywordMentions(
  keywordId: number
): Promise<{ success: boolean; data: MentionListItem[]; error?: string }> {
  try {
    const data = await api.get<MentionListItem[]>(
      `/keywords/${keywordId}/mentions`,
      { cache: 'no-store' }
    );
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Get keyword mentions error:', error);
    return { success: false, data: [], error: 'Failed to load mentions' };
  }
}

export async function getMentionInsights(
  mentionId: number
): Promise<{ success: boolean; data: QueryInsight | null; error?: string }> {
  try {
    const data = await api.get<QueryInsight>(
      `/mentions/${mentionId}/insights`,
      { cache: 'no-store' }
    );
    return { success: true, data };
  } catch (error) {
    console.error('Get insights error:', error);
    return { success: false, data: null, error: 'Failed to load insights' };
  }
}
