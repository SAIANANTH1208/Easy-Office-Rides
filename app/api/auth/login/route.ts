import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { signAuthToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = (body?.email || '').toString().trim().toLowerCase()
  const password = (body?.password || '').toString()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const { data: user, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!user || !user.password_hash) {
    return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) {
    return NextResponse.json({ error: 'Invalid login credentials.' }, { status: 401 })
  }

  const token = signAuthToken({
    sub: user.id,
    phone: user.phone_number || '',
    name: user.full_name,
  })

  const res = NextResponse.json({ user })
  res.cookies.set('adal_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
