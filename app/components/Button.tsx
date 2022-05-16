import type { ButtonHTMLAttributes } from 'react';

/** Corresponding styles are in styles/buttons.css */
type Variant = 'filled' | 'outlined' | 'flat' /* | 'raised' */;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconPosition?: 'left' | 'right';
  variant?: Variant;
}

export function Button({
  children,
  variant = 'filled',
  type = 'submit',
  ...buttonProps
}: ButtonProps) {
  return (
    <button type={type} className={`button-${variant}`} {...buttonProps}>
      {children}
    </button>
  );
}
