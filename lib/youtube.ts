interface YouTubeVideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
    standard?: { url: string };
    maxres?: { url: string };
  };
  channelTitle: string;
  publishedAt: string;
}

interface YouTubeVideo {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: YouTubeVideoSnippet;
}

interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}

export interface ProcessedVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  embedUrl: string;
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

async function makeYouTubeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    const url = new URL(`${YOUTUBE_API_BASE}${endpoint}`);
    
    // Add API key and other params
    url.searchParams.append('key', apiKey);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('YouTube API request failed:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error making YouTube request:', error);
    return null;
  }
}

export async function searchYouTubeVideos(
  query: string, 
  maxResults: number = 12
): Promise<ProcessedVideo[]> {
  const data = await makeYouTubeRequest('/search', {
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    order: 'relevance'
  });

  if (!data || !data.items) {
    return [];
  }

  const response = data as YouTubeSearchResponse;
  
  return response.items.map(video => ({
    id: video.id.videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`
  }));
}

export async function getBlinkVideos(): Promise<ProcessedVideo[]> {
  try {
    // Search for official blink-182 videos
    const officialVideos = await searchYouTubeVideos('blink-182 official music video', 8);
    
    // Search for live performances
    const liveVideos = await searchYouTubeVideos('blink-182 live performance', 4);
    
    // Combine and deduplicate by video ID
    const allVideos = [...officialVideos, ...liveVideos];
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );
    
    return uniqueVideos.slice(0, 12); // Limit to 12 total videos
  } catch (error) {
    console.error('Error fetching blink-182 videos:', error);
    return [];
  }
}

export async function searchMusicVideos(songTitle: string): Promise<ProcessedVideo[]> {
  try {
    const query = `${songTitle} blink-182 official music video`;
    return await searchYouTubeVideos(query, 3);
  } catch (error) {
    console.error('Error searching for music videos:', error);
    return [];
  }
}

export async function getVideoById(videoId: string): Promise<ProcessedVideo | null> {
  const data = await makeYouTubeRequest('/videos', {
    part: 'snippet',
    id: videoId
  });

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const video = data.items[0];
  
  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${video.id}`
  };
}

export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle different YouTube URL formats
    if (urlObj.hostname === 'youtu.be') {
      // Fixed: Return string | null consistently instead of string | undefined
      return urlObj.pathname.slice(1) || null;
    }
    
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      const videoId = urlObj.searchParams.get('v');
      return videoId || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
}

export function createEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com' ||
      urlObj.hostname === 'youtu.be'
    );
  } catch {
    return false;
  }
}