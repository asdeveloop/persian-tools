'use server';

import { headers } from 'next/headers';

export function getCspNonce(): string | null {
  return headers().get('x-csp-nonce');
}
