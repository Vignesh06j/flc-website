import { put, list } from '@vercel/blob'

const BLOB_PATHNAME = 'flc-config/playlist-id.json'

/**
 * Reads the playlist ID from Vercel Blob.
 * Falls back to YOUTUBE_PLAYLIST_ID env var if the blob doesn't exist yet.
 */
export async function getPlaylistId(): Promise<string> {
  try {
    const { blobs } = await list({ prefix: 'flc-config/playlist-id' })
    if (!blobs.length) return process.env.YOUTUBE_PLAYLIST_ID ?? ''

    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return process.env.YOUTUBE_PLAYLIST_ID ?? ''

    const data = (await res.json()) as { playlistId?: string }
    return data.playlistId ?? process.env.YOUTUBE_PLAYLIST_ID ?? ''
  } catch {
    return process.env.YOUTUBE_PLAYLIST_ID ?? ''
  }
}

/**
 * Uploads/overwrites the playlist ID blob in Vercel Blob storage.
 */
export async function setPlaylistId(playlistId: string): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify({ playlistId }), {
    access: 'public',
    allowOverwrite: true,
    contentType: 'application/json',
  })
}
