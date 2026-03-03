import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth'
import { getPlaylistId, setPlaylistId } from '@/lib/channel-config'

async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return !!token && verifySessionToken(token)
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ playlistId: getPlaylistId() })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { playlistId } = (await request.json()) as { playlistId?: string }

  if (!playlistId || typeof playlistId !== 'string' || !playlistId.trim()) {
    return NextResponse.json({ error: 'Invalid playlistId' }, { status: 400 })
  }

  setPlaylistId(playlistId.trim())
  return NextResponse.json({ success: true })
}
