import type { ReactNode } from 'react';
import Link from 'next/link';
import { cx } from './cx';
import Card from './Card';

type Props = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  meta?: string;
  className?: string;
  iconWrapClassName?: string;
};

export default function ToolCard(props: Props) {
  return (
    <Card
      data-testid="tool-card"
      className={cx(
        'group hover:shadow-[var(--shadow-strong)] transition-all duration-[var(--motion-medium)] hover:-translate-y-1.5',
        'border-[var(--border-light)] hover:border-[var(--color-primary)]',
        'bg-[var(--surface-1)]/92 backdrop-blur',
        'focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-primary)]',
        props.className,
      )}
    >
      <Link
        href={props.href}
        className="block h-full p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-lg)]"
      >
        <div className="flex h-full flex-col gap-4 text-right">
          <div
            className={cx(
              'flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] transition-all duration-[var(--motion-medium)]',
              'bg-[var(--bg-subtle)] group-hover:bg-[var(--color-primary)]/10',
              props.iconWrapClassName,
            )}
          >
            <div className="transition-transform duration-[var(--motion-medium)] group-hover:scale-110">
              {props.icon}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-[var(--motion-fast)]">
                {props.title}
              </div>
              {props.meta && (
                <span className="rounded-full border border-[var(--border-light)] bg-[var(--surface-1)]/75 px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {props.meta}
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--text-muted)] leading-relaxed">
              {props.description}
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
            مشاهده ابزار
            <span aria-hidden="true">←</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
