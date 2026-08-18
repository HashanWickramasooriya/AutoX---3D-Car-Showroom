import { usePageTitle } from '../hooks/usePageTitle'
import { Button } from '../components/ui/Button'

export function NotFound() {
  usePageTitle('Page Not Found')
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <p className="font-display text-6xl text-warm">404</p>
      <h1 className="mt-4 font-display text-2xl text-warm">This page took a wrong turn.</h1>
      <p className="mt-2 text-warm-dim">The page you're looking for doesn't exist.</p>
      <Button to="/" className="mt-8">
        Back to Home
      </Button>
    </div>
  )
}
