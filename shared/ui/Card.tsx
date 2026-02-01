import type { ReactNode, HTMLAttributes, KeyboardEvent, MouseEvent } from 'react';

type Variant = 'default' | 'clickable';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: Variant;
};

export default function Card({
  children,
  className,
  variant = 'default',
  onClick,
  ...rest
}: Props) {
  const baseClasses = 'card bg-[var(--surface-2)] backdrop-blur-xl rounded-[var(--radius-lg)] border border-[var(--border-primary)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-medium)] transition-all duration-[var(--motion-medium)]';

  const variantClasses = {
    default: '',
    clickable: 'card-clickable cursor-pointer hover:bg-[var(--surface-3)]',
  };

  const isClickable = variant === 'clickable' || typeof onClick === 'function';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className ?? ''}
      `.trim()}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
