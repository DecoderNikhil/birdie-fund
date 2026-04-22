import * as React from 'react'
import { cn } from './utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-lg bg-muted border border-white/10 text-foreground placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        'transition-colors',
        error && 'border-red-500',
        className
      )}
      {...props}
    />
  )
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-sm font-medium text-gray-300 mb-1.5', className)}
      {...props}
    >
      {children}
    </label>
  )
}