export interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
      maxres?: { url: string }
    }
    publishedAt: string
    channelTitle: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export interface YouTubePlaylist {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
    publishedAt: string
  }
  contentDetails: {
    itemCount: number
  }
}

class YouTubeAPI {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
  }

  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
    
    url.searchParams.append('key', this.apiKey)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    return response.json()
  }

  async searchVideos(query: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    const data = await this.makeRequest('search', {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      order: 'relevance'
    })

    return data.items || []
  }

  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    if (videoIds.length === 0) return []

    const data = await this.makeRequest('videos', {
      part: 'snippet,statistics',
      id: videoIds.join(',')
    })

    return data.items || []
  }

  async getChannelVideos(channelId: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    const data = await this.makeRequest('search', {
      part: 'snippet',
      channelId,
      type: 'video',
      maxResults: maxResults.toString(),
      order: 'date'
    })

    return data.items || []
  }

  async searchChannel(channelName: string): Promise<any> {
    const data = await this.makeRequest('search', {
      part: 'snippet',
      q: channelName,
      type: 'channel',
      maxResults: '1'
    })

    return data.items[0] || null
  }

  // Get blink-182 specific content
  async getBlink182Videos(): Promise<{
    musicVideos: YouTubeVideo[]
    livePerformances: YouTubeVideo[]
    interviews: YouTubeVideo[]
    recentVideos: YouTubeVideo[]
  }> {
    try {
      const [musicVideos, livePerformances, interviews, recentVideos] = await Promise.all([
        this.searchVideos('blink-182 official music video', 20),
        this.searchVideos('blink-182 live performance concert', 15),
        this.searchVideos('blink-182 interview', 10),
        this.searchVideos('blink-182', 25)
      ])

      return {
        musicVideos,
        livePerformances,
        interviews,
        recentVideos: recentVideos.slice(0, 12)
      }
    } catch (error) {
      console.error('Error fetching blink-182 YouTube data:', error)
      return {
        musicVideos: [],
        livePerformances: [],
        interviews: [],
        recentVideos: []
      }
    }
  }

  // Extract video ID from YouTube URL
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  // Get video thumbnail URL
  static getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : quality === 'high' ? 'hqdefault' : quality === 'medium' ? 'mqdefault' : 'default'}.jpg`
  }
}

export const youtubeAPI = new YouTubeAPI()