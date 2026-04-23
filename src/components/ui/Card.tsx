import * as React from 'react'
import { cn } from './utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[1.5rem] border border-white/10 p-6 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.55)] transition-colors',
        glass ? 'glass' : 'bg-white/[0.04]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-5 space-y-1', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-display font-bold text-foreground', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm leading-6 text-[#a3a1b2]', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}
