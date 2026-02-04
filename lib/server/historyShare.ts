import { randomUUID } from 'node:crypto';
import { query } from './db';
import { getHistoryEntryById, type HistoryEntry } from './history';
import { normalizeShareExpiryHours } from '@/shared/history/share';

type HistoryShareRow = {
  token: string;
  entry_id: string;
  user_id: string;
  created_at: number | string;
  expires_at: number | string;
  output_url: string | null;
};

export type HistoryShareLink = {
  token: string;
  entryId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  outputUrl: string | null;
};

export async function createHistoryShareLink(
  userId: string,
  entryId: string,
  expiresInHours?: number,
): Promise<{ link: HistoryShareLink; entry: HistoryEntry } | null> {
  const entry = await getHistoryEntryById(userId, entryId);
  if (!entry?.outputUrl) {
    return null;
  }

  const token = randomUUID();
  const createdAt = Date.now();
  const hours = normalizeShareExpiryHours(expiresInHours);
  const expiresAt = createdAt + hours * 60 * 60 * 1000;

  await query(
    `INSERT INTO history_share_links (token, entry_id, user_id, created_at, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [token, entry.id, userId, createdAt, expiresAt],
  );

  return {
    link: {
      token,
      entryId: entry.id,
      userId,
      createdAt,
      expiresAt,
      outputUrl: entry.outputUrl ?? null,
    },
    entry,
  };
}

export async function getHistoryShareLink(token: string): Promise<HistoryShareLink | null> {
  const result = await query<HistoryShareRow>(
    `SELECT history_share_links.token,
            history_share_links.entry_id,
            history_share_links.user_id,
            history_share_links.created_at,
            history_share_links.expires_at,
            history_entries.output_url
     FROM history_share_links
     JOIN history_entries ON history_entries.id = history_share_links.entry_id
     WHERE history_share_links.token = $1
     LIMIT 1`,
    [token],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    token: row.token,
    entryId: row.entry_id,
    userId: row.user_id,
    createdAt: Number(row.created_at),
    expiresAt: Number(row.expires_at),
    outputUrl: row.output_url,
  };
}
