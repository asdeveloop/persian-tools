import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Button variants based on PROJECT_STANDARDS.md
type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';

// Button sizes based on PROJECT_STANDARDS.md
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
};

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  ...rest
}: Props) {
  const baseClasses =
    'btn inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-[var(--motion-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'btn-sm h-8',
    md: 'btn-md h-10',
    lg: 'btn-lg h-12',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    danger: 'btn-danger',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-75 cursor-wait' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${loadingClass}
        ${className ?? ''}
      `.trim()}
      disabled={isLoading || disabled === true}
      aria-busy={isLoading ? true : undefined}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -me-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
