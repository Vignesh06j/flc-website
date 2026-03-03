import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth'
import { getChannelId, setChannelId } from '@/lib/channel-config'

async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return !!token && verifySessionToken(token)
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ channelId: getChannelId() })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { channelId } = (await request.json()) as { channelId?: string }

  if (!channelId || typeof channelId !== 'string' || !channelId.trim()) {
    return NextResponse.json({ error: 'Invalid channelId' }, { status: 400 })
  }

  setChannelId(channelId.trim())
  return NextResponse.json({ success: true })
}
