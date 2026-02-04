import { randomUUID } from 'node:crypto';
import { prisma } from './db';
import type { HistoryEntry as PrismaHistoryEntry } from '@prisma/client';

export type HistoryEntry = {
  id: string;
  userId: string;
  tool: string;
  inputSummary: string;
  outputSummary: string;
  outputUrl?: string | undefined;
  createdAt: number;
};

export type HistoryFilter = {
  search?: string | undefined;
  tool?: string | undefined;
  dateRange?: 'today' | 'week' | 'month' | undefined;
};

function mapHistory(row: PrismaHistoryEntry): HistoryEntry {
  return {
    id: row.id,
    userId: row.userId,
    tool: row.tool,
    inputSummary: row.inputSummary,
    outputSummary: row.outputSummary,
    outputUrl: row.outputUrl ?? undefined,
    createdAt: Number(row.createdAt),
  };
}

export async function addHistoryEntry(
  userId: string,
  data: Omit<HistoryEntry, 'id' | 'userId' | 'createdAt'>,
): Promise<HistoryEntry> {
  const entry = await prisma.historyEntry.create({
    data: {
      id: randomUUID(),
      userId,
      tool: data.tool,
      inputSummary: data.inputSummary,
      outputSummary: data.outputSummary,
      outputUrl: data.outputUrl ?? null,
      createdAt: BigInt(Date.now()),
    },
  });
  return mapHistory(entry);
}

export async function listHistoryEntries(userId: string, limit = 50): Promise<HistoryEntry[]> {
  const entries = await prisma.historyEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return entries.map(mapHistory);
}

export async function getHistoryEntryById(
  userId: string,
  entryId: string,
): Promise<HistoryEntry | null> {
  const entry = await prisma.historyEntry.findFirst({
    where: { id: entryId, userId },
  });
  if (!entry) {
    return null;
  }
  return mapHistory(entry);
}

export async function listHistoryEntriesFiltered(
  userId: string,
  filters: HistoryFilter,
  limit = 50,
): Promise<HistoryEntry[]> {
  const where: {
    userId: string;
    tool?: string;
    createdAt?: { gte: bigint };
    OR?: Array<{
      tool?: { contains: string; mode: 'insensitive' };
      inputSummary?: { contains: string; mode: 'insensitive' };
      outputSummary?: { contains: string; mode: 'insensitive' };
    }>;
  } = { userId };

  if (filters.tool) {
    where.tool = filters.tool;
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    where.OR = [
      { tool: { contains: term, mode: 'insensitive' } },
      { inputSummary: { contains: term, mode: 'insensitive' } },
      { outputSummary: { contains: term, mode: 'insensitive' } },
    ];
  }

  if (filters.dateRange) {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const rangeMs =
      filters.dateRange === 'today' ? dayMs : filters.dateRange === 'week' ? 7 * dayMs : 30 * dayMs;
    where.createdAt = { gte: BigInt(now - rangeMs) };
  }

  const entries = await prisma.historyEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return entries.map(mapHistory);
}

export async function clearHistory(userId: string): Promise<void> {
  await prisma.historyEntry.deleteMany({ where: { userId } });
}
