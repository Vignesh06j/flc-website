import { NextResponse } from 'next/server'

const YOUTUBE_PLAYLIST_ITEMS_API =
  'https://www.googleapis.com/youtube/v3/playlistItems'
const YOUTUBE_SEARCH_API = 'https://www.googleapis.com/youtube/v3/search'

export interface Thumbnail {
  url: string
  width: number
  height: number
}

export interface Snippet {
  title: string
  thumbnails: {
    maxres: Thumbnail
  }
  resourceId: {
    videoId: string
  }
}

export interface PlaylistItem {
  id: string
  snippet: Snippet
}

export interface YouTubeAPIResponse {
  items: PlaylistItem[]
  // Total number of videos in the referenced playlist (if known)
  totalVideos?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const playlistId =
      searchParams.get('playlistId') || 'PLsSk_koSv6O-KdS-GgVcG8B2GJ4FEQh4V'
    const maxResults = Number(searchParams.get('maxResults'))
    const latest = searchParams.get('latest') === 'true'

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error: missing YOUTUBE_API_KEY' },
        { status: 500 }
      )
    }

    // If latest=true, prefer using Search API ordered by date for a channel
    // This avoids walking playlist pages to get the last N items
    if (latest) {
      const channelId =
        searchParams.get('channelId') || process.env.YOUTUBE_CHANNEL_ID

      if (channelId) {
        const searchUrl = `${YOUTUBE_SEARCH_API}?part=snippet&order=date&type=video&channelId=${encodeURIComponent(
          channelId
        )}&maxResults=${maxResults}&key=${apiKey}`

        const sres = await fetch(searchUrl, { cache: 'no-store' })
        if (!sres.ok) {
          const text = await sres.text()
          return NextResponse.json(
            {
              error: 'Failed to fetch latest videos',
              status: sres.status,
              body: text,
            },
            { status: 502 }
          )
        }

        type SearchItem = {
          id: { videoId?: string }
          snippet: {
            title: string
            thumbnails: { maxres: Thumbnail }
          }
        }
        const sdata = (await sres.json()) as { items: SearchItem[] }

        // Optionally derive total videos from playlist pageInfo when a playlistId is supplied
        // or use the default playlistId above. This adds one lightweight request to get pageInfo.totalResults.
        let totalVideos: number | undefined = undefined
        try {
          const totalUrl = `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=1&playlistId=${encodeURIComponent(
            playlistId
          )}&key=${apiKey}`
          const tres = await fetch(totalUrl, { cache: 'no-store' })
          if (tres.ok) {
            const tjson = (await tres.json()) as { pageInfo?: { totalResults?: number } }
            totalVideos = tjson?.pageInfo?.totalResults
          }
        } catch {
          // ignore total video count failure; keep response functional
        }

        const mapped: YouTubeAPIResponse = {
          items: (sdata.items || [])
            .filter((it) => it.id?.videoId)
            .map((it) => ({
              id: it.id.videoId as string,
              snippet: {
                title: it.snippet.title,
                thumbnails: { maxres: it.snippet.thumbnails.maxres },
                resourceId: { videoId: it.id.videoId as string },
              },
            })),
          totalVideos,
        }

        return NextResponse.json(mapped)
      }
      // If latest requested but no channelId configured, fall back to playlist.
    }

    const url = `${YOUTUBE_PLAYLIST_ITEMS_API}?part=snippet&maxResults=${maxResults}&playlistId=${encodeURIComponent(
      playlistId
    )}&key=${apiKey}`

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: 'Failed to fetch playlist', status: res.status, body: text },
        { status: 502 }
      )
    }

    const raw = (await res.json()) as YouTubeAPIResponse & {
      pageInfo?: { totalResults?: number; resultsPerPage?: number }
    }
    const totalVideos = raw?.pageInfo?.totalResults ?? raw?.items?.length ?? 0
    const data: YouTubeAPIResponse = { items: raw.items || [], totalVideos }
    return NextResponse.json(data)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
