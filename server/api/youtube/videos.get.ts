import {fetchChannelVideos} from '../../utils/youtube'

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const {limit: limitQuery} = getQuery(event)
  const limit = Math.min(Math.max(Number(limitQuery) || 10, 1), 15)

  const channelId = config.youtubeChannelId
  if (!channelId) {
    throw createError({statusCode: 500, statusMessage: 'YouTube channel is not configured'})
  }

  return fetchChannelVideos(channelId, limit)
}, {
  maxAge: 60 * 60,
  swr: true,
})
