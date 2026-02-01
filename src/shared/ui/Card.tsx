import type { ReactNode } from 'react';
import { cx } from './cx';
import { components } from './theme';

type Variant = 'default' | 'elevated' | 'glass';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

export default function Card({ children, className, variant = 'default' }: Props) {
  const variantClasses = {
    default: components.card.base,
    elevated: components.card.elevated,
    glass: components.card.glass,
  };
  
  return (
    <div
      className={cx(
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
