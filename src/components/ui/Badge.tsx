import { cn } from './utils'

export function Badge({ 
  className, 
  variant = 'default',
  children, 
  ...props 
}: { 
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  children: React.ReactNode 
} & React.HTMLAttributes<HTMLSpanElement>) {
  const variants = {
    default: 'border border-white/10 bg-white/[0.06] text-[#d3cfdb]',
    success: 'border border-primary/15 bg-primary/15 text-primary',
    warning: 'border border-secondary/20 bg-secondary/15 text-secondary',
    error: 'border border-red-500/20 bg-red-500/15 text-red-300',
  }

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
