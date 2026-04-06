/**
 * One-time admin bootstrap endpoint.
 * Usage: GET /api/admin/init?secret=scootmart-setup-2024&email=your@email.com
 *
 * This promotes the given email to admin role.
 * Disable by removing ADMIN_INIT_SECRET env var after first use.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const SETUP_SECRET = process.env.ADMIN_INIT_SECRET ?? 'scootmart-setup-2024'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const email = searchParams.get('email')

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  try {
    const supabase = await createAdminClient()

    // Find user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError

    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json({
        error: `No user found with email: ${email}. Please sign up first at /register`
      }, { status: 404 })
    }

    // Promote to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, role: 'admin', full_name: user.user_metadata?.full_name ?? 'Admin' })

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `✅ ${email} is now an admin! Sign in at /login`,
      userId: user.id
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
