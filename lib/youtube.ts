export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[];
}

class YouTubeAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
  }

  async searchVideos(query: string): Promise<YouTubeVideo[]> {
    try {
      if (!this.apiKey) {
        console.warn('YouTube API key not configured');
        return [];
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${this.apiKey}&maxResults=20`
      );

      if (!response.ok) {
        throw new Error('Failed to search YouTube videos');
      }

      const data: YouTubeSearchResponse = await response.json();
      return data.items;
    } catch (error) {
      console.error('YouTube API error:', error);
      return [];
    }
  }

  async getBlinkVideos(): Promise<YouTubeVideo[]> {
    return this.searchVideos('blink-182');
  }
}

export const youtubeAPI = new YouTubeAPI();