import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">🛴</div>
      <h1 className="text-4xl font-bold mb-3">404 – Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Looks like this page rode off into the desert. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Link href="/"><Button>Go Home</Button></Link>
        <Link href="/browse"><Button variant="outline">Browse Listings</Button></Link>
      </div>
    </div>
  )
}
