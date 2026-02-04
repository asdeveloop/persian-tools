import { randomUUID } from 'node:crypto';
import { prisma } from './db';
import { type PlanId, getPlanById } from '@/lib/subscriptionPlans';
import type { Subscription as PrismaSubscription } from '@prisma/client';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired';

export type Subscription = {
  id: string;
  userId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  startedAt: number;
  expiresAt: number;
};

function mapSubscription(row: PrismaSubscription): Subscription {
  return {
    id: row.id,
    userId: row.userId,
    planId: row.planId as PlanId,
    status: row.status as SubscriptionStatus,
    startedAt: Number(row.startedAt),
    expiresAt: Number(row.expiresAt),
  };
}

export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const now = BigInt(Date.now());
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      expiresAt: { gt: now },
    },
    orderBy: { startedAt: 'desc' },
  });
  if (!subscription) {
    return null;
  }
  return mapSubscription(subscription);
}

export async function createSubscription(userId: string, planId: PlanId): Promise<Subscription> {
  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error('PLAN_NOT_FOUND');
  }
  const now = BigInt(Date.now());
  const expiresAt = now + BigInt(plan.periodDays) * 24n * 60n * 60n * 1000n;

  const [, created] = await prisma.$transaction([
    prisma.subscription.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'expired' },
    }),
    prisma.subscription.create({
      data: {
        id: randomUUID(),
        userId,
        planId,
        status: 'active',
        startedAt: now,
        expiresAt,
      },
    }),
  ]);

  return mapSubscription(created);
}
