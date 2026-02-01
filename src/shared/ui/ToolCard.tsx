import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from './cx';
import Card from './Card';

type Props = {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
};

export default function ToolCard(props: Props) {
  return (
    <Card className={cx(
      'group hover:shadow-lg transition-all duration-[var(--motion-medium)] hover:-translate-y-1',
      'border-[var(--border-primary)] hover:border-[var(--color-primary)]',
      'focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2',
      props.className
    )}>
      <Link 
        to={props.to} 
        className="block p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-lg)]"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cx(
            'flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-[var(--motion-medium)]',
            'bg-[var(--surface-1)] group-hover:bg-[var(--color-primary)]/10'
          )}>
            <div className="transition-transform duration-[var(--motion-medium)] group-hover:scale-110">
              {props.icon}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-[var(--motion-fast)]">
              {props.title}
            </div>
            <div className="text-sm text-[var(--text-muted)] leading-relaxed">
              {props.description}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
