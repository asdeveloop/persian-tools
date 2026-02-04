import { describe, it, expect } from 'vitest';
import { buildHistoryQuery } from '@/shared/history/recordHistory';

describe('History Query Builder', () => {
  it('should include limit by default', () => {
    expect(buildHistoryQuery(undefined, 50)).toBe('?limit=50');
  });

  it('should include search and tool filters', () => {
    const query = buildHistoryQuery({ search: 'merge', tool: 'pdf-merge' }, 100);
    expect(query).toBe('?limit=100&search=merge&tool=pdf-merge');
  });

  it('should include date range when provided', () => {
    const query = buildHistoryQuery({ dateRange: 'week' }, 25);
    expect(query).toBe('?limit=25&dateRange=week');
  });

  it('should ignore empty filters', () => {
    const query = buildHistoryQuery({ search: '   ', tool: '' }, 10);
    expect(query).toBe('?limit=10');
  });
});
