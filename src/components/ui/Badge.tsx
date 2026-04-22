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
    default: 'bg-white/10 text-gray-300',
    success: 'bg-primary/20 text-primary',
    warning: 'bg-secondary/20 text-secondary',
    error: 'bg-red-500/20 text-red-500',
  }

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}