import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  errorMessage?: string | null;
  label?: string | null;
  name: string; // required
}

export function InputField({
  errorMessage = null,
  label = null,
  name,
  ...inputProps
}: InputFieldProps) {
  return (
    <div>
      {label && <label htmlFor={`${name}-input`}>{label}</label>}

      <input
        id={`${name}-input`}
        name={name}
        aria-invalid={Boolean(errorMessage) || undefined}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
        {...inputProps}
      />

      {errorMessage && (
        <p className="form-validation-error" role="alert" id={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
