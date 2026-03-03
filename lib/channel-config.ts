import fs from 'node:fs'
import path from 'node:path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'channel.json')

export function getChannelId(): string {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    const data = JSON.parse(raw) as { channelId?: string }
    return data.channelId ?? process.env.YOUTUBE_CHANNEL_ID ?? ''
  } catch {
    return process.env.YOUTUBE_CHANNEL_ID ?? ''
  }
}

export function setChannelId(channelId: string): void {
  const dir = path.dirname(CONFIG_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ channelId }, null, 2), 'utf-8')
}
