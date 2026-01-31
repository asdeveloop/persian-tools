import { describe, expect, it } from 'vitest';
import { presetRanges, presetLabelFa } from './imageCompress.presets';
import { formatBytesFa } from './imageCompress.logic';

describe('image compress presets', () => {
  it('should define ranges', () => {
    expect(presetRanges.very_low.maxBytes).toBe(150 * 1024);
    expect(presetRanges.medium.minBytes).toBe(150 * 1024);
    expect(presetRanges.high.maxBytes).toBe(400 * 1024);
  });

  it('should have persian labels', () => {
    expect(presetLabelFa('very_low')).toContain('حجم');
  });

  it('should format bytes in fa', () => {
    expect(formatBytesFa(1024)).toContain('کیلوبایت');
  });
});
