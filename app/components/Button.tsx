import type { ButtonHTMLAttributes } from 'react';
import { useRef } from 'react';

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
  const ref = useRef<HTMLButtonElement | null>(null);
  const buttonType = type || (ref.current?.closest('form') ? 'submit' : 'button');
  return (
    <button ref={ref} type={buttonType} className={`button-${variant}`} {...buttonProps}>
      {children}
    </button>
  );
}
