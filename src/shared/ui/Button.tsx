import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

type Variant = 'primary' | 'secondary';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

export default function Button({ className, variant = 'primary', ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const styles =
    variant === 'primary'
      ? 'bg-[#e5322d] text-white hover:bg-[#cc2a26] focus:ring-[#e5322d]'
      : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400';

  return <button className={cx(base, styles, className)} {...rest} />;
}
