import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import { colors, components } from './theme';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export default function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  ...rest 
}: Props) {
  const baseClasses = components.button.base;
  
  const sizeClasses = {
    sm: 'px-6 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  };
  
  const variantClasses = {
    primary: `text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 focus:ring-blue-500`,
    secondary: `text-black bg-white border border-black hover:bg-gray-100 focus:ring-black`,
    success: `text-white bg-green-600 border border-green-600 hover:bg-green-700 focus:ring-green-500`,
    warning: `text-white bg-amber-600 border border-amber-600 hover:bg-amber-700 focus:ring-amber-500`,
    danger: `text-white bg-red-600 border border-red-600 hover:bg-red-700 focus:ring-red-500`,
    info: `text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 focus:ring-blue-400`,
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={cx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        widthClass,
        className
      )} 
      {...rest} 
    />
  );
}
