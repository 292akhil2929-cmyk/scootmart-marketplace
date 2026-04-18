'use client'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>ScootMart.ae</h1>
          <p style={{ color: '#71717a', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            A critical error occurred. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  )
}
