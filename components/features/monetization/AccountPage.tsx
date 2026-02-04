'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import Input from '@/shared/ui/Input';
import { buildHistoryQuery } from '@/shared/history/recordHistory';
import type { HistoryEntry } from '@/shared/history/types';
import { SUBSCRIPTION_PLANS, type PlanId } from '@/lib/subscriptionPlans';

type UserInfo = {
  id: string;
  email: string;
  createdAt: number;
};

type SubscriptionInfo = {
  id: string;
  planId: PlanId;
  status: 'active' | 'canceled' | 'expired';
  startedAt: number;
  expiresAt: number;
};

type HistoryFilterState = {
  search: string;
  tool: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
};

type ShareLinkState = {
  url: string;
  expiresAt: number;
  loading?: boolean;
  error?: string;
};

const SEARCH_DEBOUNCE_MS = 400;

const formatDate = (value: number) =>
  new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyFilters, setHistoryFilters] = useState<HistoryFilterState>({
    search: '',
    tool: 'all',
    dateRange: 'all',
  });
  const [searchInput, setSearchInput] = useState('');
  const [shareLinks, setShareLinks] = useState<Record<string, ShareLinkState>>({});
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planId, setPlanId] = useState<PlanId>('basic_monthly');
  const [historyTool, setHistoryTool] = useState('pdf-merge');
  const [historyInput, setHistoryInput] = useState('3 فایل PDF');
  const [historyOutput, setHistoryOutput] = useState('merge.pdf');
  const [historyOutputUrl, setHistoryOutputUrl] = useState('');

  const loadAccount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!response.ok) {
        setUser(null);
        setSubscription(null);
        setHistory([]);
        return;
      }
      const data = (await response.json()) as { user: UserInfo; subscription?: SubscriptionInfo };
      setUser(data.user);
      setSubscription(data.subscription ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    if (!subscription) {
      return;
    }
    const query = buildHistoryQuery(
      {
        search: historyFilters.search?.trim() || undefined,
        tool:
          historyFilters.tool && historyFilters.tool !== 'all' ? historyFilters.tool : undefined,
        dateRange: historyFilters.dateRange === 'all' ? undefined : historyFilters.dateRange,
      },
      200,
    );
    const response = await fetch(`/api/history${query}`, { cache: 'no-store' });
    if (!response.ok) {
      setHistory([]);
      return;
    }
    const data = (await response.json()) as { entries: HistoryEntry[] };
    setHistory(data.entries ?? []);
  }, [subscription, historyFilters]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setHistoryFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchInput]);

  const planOptions = useMemo(() => SUBSCRIPTION_PLANS, []);
  const historyTools = useMemo(() => {
    const tools = Array.from(new Set(history.map((entry) => entry.tool)));
    return tools;
  }, [history]);

  const handleRegister = async () => {
    setAuthError(null);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setAuthError('ثبت‌نام ناموفق بود. لطفاً ایمیل یا رمز را بررسی کنید.');
      return;
    }
    await loadAccount();
  };

  const handleLogin = async () => {
    setAuthError(null);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setAuthError('ورود ناموفق بود. لطفاً اطلاعات را بررسی کنید.');
      return;
    }
    await loadAccount();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setSubscription(null);
    setHistory([]);
  };

  const handleCheckout = async () => {
    const response = await fetch('/api/subscription/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    if (!response.ok) {
      return;
    }
    const data = (await response.json()) as { payUrl?: string };
    if (data.payUrl) {
      router.push(data.payUrl);
    }
  };

  const handleHistorySample = async () => {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: historyTool,
        inputSummary: historyInput,
        outputSummary: historyOutput,
        outputUrl: historyOutputUrl.trim() || undefined,
      }),
    });
    await loadHistory();
  };

  const handleHistoryClear = async () => {
    await fetch('/api/history', { method: 'DELETE' });
    setHistory([]);
  };

  const handleFiltersReset = () => {
    setHistoryFilters({ search: '', tool: 'all', dateRange: 'all' });
    setSearchInput('');
  };

  const handleShareLink = async (entryId: string) => {
    setShareLinks((prev) => ({
      ...prev,
      [entryId]: {
        ...(prev[entryId] ?? { url: '', expiresAt: 0 }),
        loading: true,
        error: undefined,
      },
    }));

    const response = await fetch('/api/history/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId, expiresInHours: 24 }),
    });

    if (!response.ok) {
      setShareLinks((prev) => ({
        ...prev,
        [entryId]: {
          url: '',
          expiresAt: 0,
          loading: false,
          error: 'ساخت لینک امن ناموفق بود.',
        },
      }));
      return;
    }

    const data = (await response.json()) as { shareUrl: string; expiresAt: number };
    const absoluteUrl =
      typeof window !== 'undefined'
        ? new URL(data.shareUrl, window.location.origin).toString()
        : data.shareUrl;

    setShareLinks((prev) => ({
      ...prev,
      [entryId]: {
        url: absoluteUrl,
        expiresAt: data.expiresAt,
        loading: false,
      },
    }));
  };

  const handleCopyShareLink = async (entryId: string) => {
    const link = shareLinks[entryId];
    if (!link?.url) {
      return;
    }
    try {
      await navigator.clipboard.writeText(link.url);
      setShareLinks((prev) => ({
        ...prev,
        [entryId]: { ...link, error: undefined },
      }));
    } catch {
      setShareLinks((prev) => ({
        ...prev,
        [entryId]: { ...link, error: 'کپی لینک انجام نشد.' },
      }));
    }
  };

  if (loading) {
    return <div className="text-sm text-[var(--text-muted)]">در حال بارگذاری...</div>;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <section className="section-surface p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">
            ورود یا ثبت‌نام
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            برای فعال‌سازی تاریخچه کارها، وارد شوید یا حساب بسازید.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <div className="text-lg font-bold">ثبت‌نام</div>
            <Input label="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              label="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="button" onClick={handleRegister}>
              ثبت‌نام
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="text-lg font-bold">ورود</div>
            <Input label="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              label="رمز عبور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={handleLogin}>
              ورود
            </Button>
          </Card>
        </div>

        {authError && <div className="text-sm text-[var(--color-danger)]">{authError}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="section-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">
              حساب کاربری
            </h1>
            <p className="text-[var(--text-secondary)]">{user.email}</p>
          </div>
          <Button type="button" variant="tertiary" onClick={handleLogout}>
            خروج
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 space-y-3">
          <div className="text-lg font-bold">وضعیت اشتراک</div>
          {subscription ? (
            <div className="text-sm text-[var(--text-muted)] space-y-1">
              <div>پلن: {subscription.planId}</div>
              <div>وضعیت: {subscription.status}</div>
              <div>انقضا: {formatDate(subscription.expiresAt)}</div>
            </div>
          ) : (
            <div className="text-sm text-[var(--text-muted)]">اشتراکی فعال نیست.</div>
          )}
        </Card>

        <Card className="p-6 space-y-3">
          <div className="text-lg font-bold">شروع اشتراک</div>
          <label className="space-y-2 text-sm text-[var(--text-primary)]">
            انتخاب پلن
            <select
              className="input w-full px-4 py-3 bg-[var(--surface-1)] border border-[var(--border-light)] rounded-[var(--radius-md)]"
              value={planId}
              onChange={(event) => setPlanId(event.target.value as PlanId)}
            >
              {planOptions.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.title} - {plan.price.toLocaleString('fa-IR')} تومان
                </option>
              ))}
            </select>
          </label>
          <Button type="button" onClick={handleCheckout}>
            پرداخت و فعال‌سازی
          </Button>
          <div className="text-xs text-[var(--text-muted)]">
            این مسیر فعلاً پرداخت آزمایشی است و بعداً به درگاه واقعی متصل می‌شود.
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-lg font-bold">تاریخچه کارها</div>
            <div className="text-xs text-[var(--text-muted)]">{history.length} مورد</div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="جستجو"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="نام ابزار یا خلاصه ورودی/خروجی"
            />
            <label className="space-y-2 text-sm text-[var(--text-primary)]">
              فیلتر ابزار
              <select
                className="input w-full px-4 py-3 bg-[var(--surface-1)] border border-[var(--border-light)] rounded-[var(--radius-md)]"
                value={historyFilters.tool ?? 'all'}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({ ...prev, tool: event.target.value }))
                }
              >
                <option value="all">همه ابزارها</option>
                {historyTools.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-[var(--text-primary)]">
              بازه زمانی
              <select
                className="input w-full px-4 py-3 bg-[var(--surface-1)] border border-[var(--border-light)] rounded-[var(--radius-md)]"
                value={historyFilters.dateRange ?? 'all'}
                onChange={(event) =>
                  setHistoryFilters((prev) => ({
                    ...prev,
                    dateRange: event.target.value as HistoryFilterState['dateRange'],
                  }))
                }
              >
                <option value="all">همه زمان‌ها</option>
                <option value="today">امروز</option>
                <option value="week">۷ روز اخیر</option>
                <option value="month">۳۰ روز اخیر</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="tertiary" onClick={handleFiltersReset}>
              پاکسازی فیلترها
            </Button>
          </div>
          {subscription ? (
            <div className="space-y-3">
              {history.length === 0 && (
                <div className="text-sm text-[var(--text-muted)]">هنوز موردی ثبت نشده است.</div>
              )}
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[var(--radius-md)] border border-[var(--border-light)] bg-[var(--surface-1)] px-4 py-3 text-sm"
                >
                  <div className="font-semibold text-[var(--text-primary)]">{entry.tool}</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {entry.inputSummary} → {entry.outputSummary}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {formatDate(entry.createdAt)}
                  </div>
                  {entry.outputUrl && (
                    <div className="mt-3 space-y-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border-light)] bg-[var(--surface-2)] px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => void handleShareLink(entry.id)}
                          disabled={shareLinks[entry.id]?.loading}
                        >
                          {shareLinks[entry.id]?.loading ? 'در حال ساخت لینک...' : 'ساخت لینک امن'}
                        </Button>
                        {shareLinks[entry.id]?.url && (
                          <Button
                            type="button"
                            size="sm"
                            variant="tertiary"
                            onClick={() => void handleCopyShareLink(entry.id)}
                          >
                            کپی لینک
                          </Button>
                        )}
                      </div>
                      {shareLinks[entry.id]?.url && (
                        <div className="text-xs text-[var(--text-muted)] break-all">
                          {shareLinks[entry.id]?.url}
                        </div>
                      )}
                      {shareLinks[entry.id]?.expiresAt ? (
                        <div className="text-xs text-[var(--text-muted)]">
                          انقضا: {formatDate(shareLinks[entry.id]?.expiresAt ?? 0)}
                        </div>
                      ) : null}
                      {shareLinks[entry.id]?.error && (
                        <div className="text-xs text-[var(--color-danger)]">
                          {shareLinks[entry.id]?.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--text-muted)]">
              برای مشاهده تاریخچه، ابتدا اشتراک را فعال کنید.
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div className="text-lg font-bold">ثبت نمونه تاریخچه</div>
          <Input
            label="نام ابزار"
            value={historyTool}
            onChange={(e) => setHistoryTool(e.target.value)}
          />
          <Input
            label="خلاصه ورودی"
            value={historyInput}
            onChange={(e) => setHistoryInput(e.target.value)}
          />
          <Input
            label="خلاصه خروجی"
            value={historyOutput}
            onChange={(e) => setHistoryOutput(e.target.value)}
          />
          <Input
            label="لینک خروجی (اختیاری)"
            value={historyOutputUrl}
            onChange={(e) => setHistoryOutputUrl(e.target.value)}
            placeholder="/api/files/sample.pdf"
          />
          <Button type="button" onClick={handleHistorySample}>
            ثبت نمونه
          </Button>
          <Button type="button" variant="tertiary" onClick={handleHistoryClear}>
            پاکسازی تاریخچه
          </Button>
        </Card>
      </section>
    </div>
  );
}
