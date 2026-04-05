import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100', className)}>
      <ShieldCheck className="h-3 w-3" /> Verified Seller
    </span>
  )
}

export function UAETestedBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800 dark:bg-orange-900 dark:text-orange-100', className)}>
      🌡️ UAE-Tested
    </span>
  )
}

export function CertifiedUsedBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900 dark:text-purple-100', className)}>
      <ShieldCheck className="h-3 w-3" /> Certified Used
    </span>
  )
}

export function RTABadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-100', className)}>
      ✓ RTA Compliant
    </span>
  )
}

export function EscrowBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100', className)}>
      🔒 Escrow Protected
    </span>
  )
}
