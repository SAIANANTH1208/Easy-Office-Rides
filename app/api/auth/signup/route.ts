import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { signAuthToken } from '@/lib/auth'
import { normalizePhone } from '@/lib/phone'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const fullName = (body?.full_name || '').toString().trim()
  const email = (body?.email || '').toString().trim().toLowerCase()
  const phoneNumber = normalizePhone(body?.phone_number || '')
  const password = (body?.password || '').toString()

  if (!fullName || !email || !password) {
    return NextResponse.json({ error: 'Full name, email, and password are required.' }, { status: 400 })
  }

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 })
  }

  if (existing) {
    return NextResponse.json({ error: 'Email already exists.' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const { data: user, error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      full_name: fullName,
      email,
      phone_number: phoneNumber || null,
      password_hash: passwordHash,
    })
    .select('*')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
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
