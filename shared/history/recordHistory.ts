export type HistoryPayload = {
  tool: string;
  inputSummary: string;
  outputSummary: string;
  outputUrl?: string | undefined;
};

export type HistoryFilters = {
  search?: string | undefined;
  tool?: string | undefined;
  dateRange?: 'today' | 'week' | 'month' | undefined;
};

export function buildHistoryQuery(filters?: HistoryFilters, limit = 50): string {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  if (filters?.search?.trim()) {
    params.set('search', filters.search.trim());
  }
  if (filters?.tool?.trim()) {
    params.set('tool', filters.tool.trim());
  }
  if (filters?.dateRange) {
    params.set('dateRange', filters.dateRange);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function normalizeHistoryOutputUrl(outputUrl?: string): string | undefined {
  if (!outputUrl) {
    return undefined;
  }
  const trimmed = outputUrl.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return undefined;
  }
  return trimmed;
}

export async function recordHistory(payload: HistoryPayload): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        outputUrl: normalizeHistoryOutputUrl(payload.outputUrl),
      }),
    });
  } catch {
    // silent fail to avoid impacting UX
  }
}
