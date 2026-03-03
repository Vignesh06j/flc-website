import { NextResponse } from 'next/server'
import { getPlaylistId } from '@/lib/channel-config'

export async function GET() {
  return NextResponse.json({ playlistId: getPlaylistId() })
}