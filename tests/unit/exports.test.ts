import { describe, expect, it } from 'vitest';
import * as utils from '@/shared/utils';
import * as numbers from '@/shared/utils/numbers';
import * as localization from '@/shared/utils/localization';

describe('shared exports', () => {
  it('re-exports utilities', () => {
    expect(typeof utils.parseLooseNumber).toBe('function');
    expect(typeof numbers.toEnglishDigits).toBe('function');
    expect(typeof localization.toPersianNumbers).toBe('function');
  });
});
