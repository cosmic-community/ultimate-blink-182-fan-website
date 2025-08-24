export interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
      high?: {
        url: string
      }
    }
    channelTitle: string
    publishedAt: string
  }
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[]
  nextPageToken?: string
}

export interface YouTubePlaylistResponse {
  items: Array<{
    snippet: {
      resourceId: {
        videoId: string
      }
      title: string
      description: string
      thumbnails: {
        medium: {
          url: string
        }
        high?: {
          url: string
        }
      }
      channelTitle: string
      publishedAt: string
    }
  }>
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3'

export async function searchYouTubeVideos(query: string, maxResults: number = 12): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key not configured')
    return []
  }

  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_BASE_URL}/search?${searchParams}`)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data: YouTubeSearchResponse = await response.json()
    return data.items || []
  } catch (error) {
    console.error('YouTube search error:', error)
    return []
  }
}

export async function getBlink182MusicVideos(): Promise<YouTubeVideo[]> {
  return await searchYouTubeVideos('blink-182 official music video', 20)
}

export async function getBlink182LivePerformances(): Promise<YouTubeVideo[]> {
  return await searchYouTubeVideos('blink-182 live performance concert', 15)
}

export async function getBlink182Interviews(): Promise<YouTubeVideo[]> {
  return await searchYouTubeVideos('blink-182 interview Tom DeLonge Mark Hoppus Travis Barker', 10)
}

export async function getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key not configured')
    return []
  }

  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      playlistId: playlistId,
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_BASE_URL}/playlistItems?${searchParams}`)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data: YouTubePlaylistResponse = await response.json()
    
    // Convert playlist items to video format
    return data.items?.map(item => ({
      id: {
        videoId: item.snippet.resourceId.videoId
      },
      snippet: {
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: item.snippet.thumbnails,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }
    })) || []
  } catch (error) {
    console.error('YouTube playlist error:', error)
    return []
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export function getVideoThumbnailUrl(video: YouTubeVideo): string {
  // Fix for line 154 - handle undefined high quality thumbnail
  const highQualityThumbnail = video.snippet.thumbnails.high?.url
  const mediumQualityThumbnail = video.snippet.thumbnails.medium.url
  
  // Return high quality if available, otherwise medium quality (never undefined)
  return highQualityThumbnail ?? mediumQualityThumbnail
}

export function formatVideoTitle(title: string): string {
  // Clean up common YouTube title patterns
  return title
    .replace(/\(Official.*?\)/gi, '')
    .replace(/\[Official.*?\]/gi, '')
    .replace(/- blink-182/gi, '')
    .replace(/blink-182 -/gi, '')
    .trim()
}

export function formatVideoDuration(duration: string): string {
  // Handle YouTube duration format (ISO 8601)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return '0:00'
  
  const hours = (match[1] || '').replace('H', '')
  const minutes = (match[2] || '').replace('M', '')
  const seconds = (match[3] || '').replace('S', '')
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }
  
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`
}