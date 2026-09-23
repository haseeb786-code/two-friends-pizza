'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string; // Strictly required for accessible label binding
  label: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

/**
 * Accessible Form Field Component
 * 
 * - Enforces explicit label-to-input association (htmlFor / id)
 * - Associates helper text and validation errors via aria-describedby
 * - Sets aria-invalid and role="alert" on errors for screen readers
 * - High-contrast visible focus ring matching design tokens
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      required,
      className,
      containerClassName,
      ...rest
    },
    ref
  ) => {
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('flex flex-col space-y-1.5', containerClassName)}>
        <label
          htmlFor={id}
          className="text-xs font-medium text-obsidian-200 tracking-wide flex items-center gap-1"
        >
          <span>{label}</span>
          {required && (
            <span className="text-flame-400" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'w-full px-3.5 py-2.5 bg-obsidian-900 border rounded-lg text-sm text-white placeholder-obsidian-500',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/80',
            error
              ? 'border-flame-500/80 text-flame-200 focus:ring-flame-500'
              : 'border-white/10 hover:border-white/20',
            className
          )}
          {...rest}
        />

        {error && (
          <p id={errorId} role="alert" className="text-xs text-flame-400">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-obsidian-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
