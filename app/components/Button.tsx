import type { ButtonHTMLAttributes } from 'react';
import { useRef } from 'react';

/** Corresponding styles are in styles/buttons.css */
type Variant = 'filled' | 'outlined' | 'flat' /* | 'raised' */;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  variant?: Variant;
}

export function Button({
  children,
  loading = false,
  variant = 'filled',
  type = 'submit',
  ...buttonProps
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const buttonType = type || (ref.current?.closest('form') ? 'submit' : 'button');
  return (
    <button
      ref={ref}
      type={buttonType}
      disabled={loading}
      className={`button-${variant}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
