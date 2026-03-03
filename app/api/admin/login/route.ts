import { NextResponse } from 'next/server'
import { generateSessionToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = generateSessionToken()
  const response = NextResponse.json({ success: true })

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return response
}
