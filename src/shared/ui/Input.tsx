import type { InputHTMLAttributes, ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export default function Input({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  className,
  id,
  ...rest
}: Props) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseClasses = 'input w-full px-4 py-3 bg-[var(--surface-1)] border border-[var(--border-primary)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-[var(--motion-fast)]';
  const errorClasses = error ? 'input-error border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : '';
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--text-primary)] rtl-fix"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            ${baseClasses}
            ${errorClasses}
            ${startIcon ? 'ps-10' : ''}
            ${endIcon ? 'pe-10' : ''}
            ${className || ''}
          `.trim()}
          {...rest}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-[var(--color-danger)] rtl-fix">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-[var(--text-muted)] rtl-fix">
          {helperText}
        </p>
      )}
    </div>
  );
}
