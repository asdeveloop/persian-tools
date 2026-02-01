import type { ReactNode, HTMLAttributes } from 'react';

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
  
  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className || ''}
      `.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}
