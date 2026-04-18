import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? searchParams.get('redirect') ?? '/'
  const type = searchParams.get('type') ?? ''
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Provider returned an error
  if (errorParam) {
    console.error('[Auth Callback] Provider error:', errorParam, errorDescription)
    const msg = errorDescription ?? errorParam
    return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent(msg)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[Auth Callback] Exchange error:', error.message)
      const msg =
        error.message.includes('expired') ? 'Link expired — please request a new one.' :
        error.message.includes('invalid') ? 'Invalid link — please try again.' :
        'Sign in failed. Please try again.'
      return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent(msg)}`)
    }

    if (data.user) {
      // Upsert profile on first OAuth login
      const meta = data.user.user_metadata
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: meta?.full_name ?? meta?.name ?? null,
        avatar_url: meta?.avatar_url ?? meta?.picture ?? null,
        role: 'buyer',
      }, { onConflict: 'id', ignoreDuplicates: true })

      // Send welcome email to new OAuth users (only if profile was just created)
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('id', data.user.id)
      if (count === 1 && data.user.email && meta?.full_name) {
        sendWelcomeEmail(data.user.email, meta.full_name).catch(console.error)
      }
    }

    if (type === 'recovery') {
      return NextResponse.redirect(`${origin}/reset-password`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?message=${encodeURIComponent('No code provided — please try signing in again.')}`)
}
