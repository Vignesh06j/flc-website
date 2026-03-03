import fs from 'node:fs'
import path from 'node:path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'channel.json')

export function getPlaylistId(): string {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    const data = JSON.parse(raw) as { playlistId?: string }
    return data.playlistId ?? ''
  } catch {
    return ''
  }
}

export function setPlaylistId(playlistId: string): void {
  const dir = path.dirname(CONFIG_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ playlistId }, null, 2), 'utf-8')
}
