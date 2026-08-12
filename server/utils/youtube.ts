export type YouTubeVideo = {
  id: string
  title: string
  publishedAt: string
  thumbnailUrl: string
  url: string
}

function decodeXml(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function parseYouTubeFeed(xml: string): YouTubeVideo[] {
  return xml
    .split('<entry>')
    .slice(1)
    .map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? ''
      const title = entry.match(/<media:title>([^<]+)<\/media:title>/)?.[1]
        ?? entry.match(/<title>([^<]+)<\/title>/)?.[1]
        ?? ''
      const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
      const thumbnailUrl = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1]
        ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '')

      return {
        id,
        title: decodeXml(title),
        publishedAt,
        thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${id}`,
      }
    })
    .filter((video) => video.id)
}

export async function fetchChannelVideos(channelId: string, limit = 10): Promise<YouTubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  const xml = await $fetch<string>(feedUrl, {responseType: 'text'})
  return parseYouTubeFeed(xml).slice(0, limit)
}
