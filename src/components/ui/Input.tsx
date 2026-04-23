import * as React from 'react'
import { cn } from './utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-foreground placeholder:text-[#7f7c8f]',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
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
      className={cn('mb-1.5 block text-sm font-medium text-[#d7d3df]', className)}
      {...props}
    >
      {children}
    </label>
  )
}
