export type HistoryPayload = {
  tool: string;
  inputSummary: string;
  outputSummary: string;
  outputUrl?: string;
};

export async function recordHistory(payload: HistoryPayload): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // silent fail to avoid impacting UX
  }
}
