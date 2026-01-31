import type { ReactNode } from 'react';
import { cx } from './cx';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card(props: Props) {
  return (
    <div
      className={cx(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        'transition-colors',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
