import * as React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-primary text-background shadow-[0_18px_40px_-18px_rgba(0,200,150,0.9)] hover:-translate-y-0.5 hover:bg-primary/90',
    secondary:
      'bg-secondary text-background shadow-[0_18px_40px_-18px_rgba(245,166,35,0.75)] hover:-translate-y-0.5 hover:bg-secondary/90',
    ghost: 'bg-white/5 text-foreground hover:bg-white/10',
    outline: 'border border-white/15 bg-white/[0.03] text-foreground hover:border-primary/35 hover:bg-white/[0.06]',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        'border border-transparent duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
