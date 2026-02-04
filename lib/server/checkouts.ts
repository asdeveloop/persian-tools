import { randomUUID } from 'node:crypto';
import { prisma } from './db';
import { type PlanId } from '@/lib/subscriptionPlans';
import type { Checkout as PrismaCheckout } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type CheckoutStatus = 'pending' | 'paid' | 'canceled';

export type Checkout = {
  id: string;
  userId: string;
  planId: PlanId;
  status: CheckoutStatus;
  createdAt: number;
  paidAt: number | null;
};

function mapCheckout(row: PrismaCheckout): Checkout {
  return {
    id: row.id,
    userId: row.userId,
    planId: row.planId as PlanId,
    status: row.status as CheckoutStatus,
    createdAt: Number(row.createdAt),
    paidAt: row.paidAt === null ? null : Number(row.paidAt),
  };
}

export async function createCheckout(userId: string, planId: PlanId): Promise<Checkout> {
  const checkout = await prisma.checkout.create({
    data: {
      id: randomUUID(),
      userId,
      planId,
      status: 'pending',
      createdAt: BigInt(Date.now()),
      paidAt: null,
    },
  });
  return mapCheckout(checkout);
}

export async function getCheckoutById(id: string): Promise<Checkout | null> {
  const checkout = await prisma.checkout.findUnique({ where: { id } });
  if (!checkout) {
    return null;
  }
  return mapCheckout(checkout);
}

export async function markCheckoutPaid(id: string): Promise<Checkout | null> {
  const now = BigInt(Date.now());
  try {
    const checkout = await prisma.checkout.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: now,
      },
    });
    return mapCheckout(checkout);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null;
    }
    throw error;
  }
}
