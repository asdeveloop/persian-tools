import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

type Variant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

export default function Button({ className, variant = 'primary', ...rest }: Props) {
  const base =
    'inline-flex items-center justify-center px-8 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md rounded-full';

  const styles =
    variant === 'primary'
      ? 'text-black bg-white border border-black hover:bg-gray-100 hover:shadow-lg hover:scale-105 focus:ring-black'
      : variant === 'secondary'
      ? 'text-white bg-black border border-black hover:bg-gray-900 hover:shadow-lg hover:scale-105 focus:ring-black'
      : variant === 'accent'
      ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 focus:ring-blue-500'
      : variant === 'success'
      ? 'text-white bg-green-600 border border-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105 focus:ring-green-500'
      : variant === 'warning'
      ? 'text-white bg-amber-600 border border-amber-600 hover:bg-amber-700 hover:shadow-lg hover:scale-105 focus:ring-amber-500'
      : variant === 'danger'
      ? 'text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:shadow-lg hover:scale-105 focus:ring-red-500'
      : 'text-black bg-white border border-black hover:bg-gray-100 hover:shadow-lg hover:scale-105 focus:ring-black';

  return <button className={cx(base, styles, className)} {...rest} />;
}
