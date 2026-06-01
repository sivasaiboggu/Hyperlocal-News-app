import * as Location from 'expo-location';
import axios from 'axios';
import { INewsRepository } from './INewsRepository';
import { CategoryType, FeedItem, Comment, PaginatedResponse } from '../../../core/types';
import { generateMockComments } from '../../../core/mocks';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Category-based high-resolution, instant-loading Unsplash fallback images to guarantee visual excellence
const HIGH_RES_FALLBACK_IMAGES: Record<string, string[]> = {
  Local: [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop',
  ],
  Politics: [
    'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop',
  ],
  Entertainment: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
  ],
  Business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
  ],
  Health: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  ],
  International: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=600&auto=format&fit=crop',
  ],
};

export function parseRssXml(xml: string): any[] {
  const items: any[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  
  const cleanTag = (content: string, tag: string): string => {
    const tagRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
    const m = content.match(tagRegex);
    if (!m) return '';
    let val = m[1];
    // Remove CDATA if present
    val = val.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
    // Decode HTML entities
    return val
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .trim();
  };

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const title = cleanTag(itemContent, 'title');
    const link = cleanTag(itemContent, 'link');
    const pubDate = cleanTag(itemContent, 'pubDate');
    const rawDescription = cleanTag(itemContent, 'description');
    
    // Extract thumbnail from rawDescription (Google News RSS puts it in an img tag)
    let thumbnail = '';
    const imgMatch = rawDescription.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) {
      thumbnail = imgMatch[1];
    }

    // Clean html from description for plain text content
    const description = rawDescription.replace(/<[^>]*>/g, '').trim();

    // Parse source name from <source> tag
    const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
    let sourceName = '';
    if (sourceMatch) {
      sourceName = sourceMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    }

    if (title) {
      items.push({
        title,
        link,
        pubDate,
        description,
        thumbnail,
        sourceName: sourceName || 'News Source',
      });
    }
  }
  return items;
}

export class MockNewsRepository implements INewsRepository {
  private networkDelayMs: number;

  constructor(networkDelayMs: number = 800) {
    this.networkDelayMs = networkDelayMs;
  }

  async fetchCategories(): Promise<CategoryType[]> {
    await delay(200);
    return [
      'Local',
      'Sports',
      'Politics',
      'Entertainment',
      'Business',
      'Technology',
      'Health',
      'International',
    ];
  }

  // Requests GPS coordinates and reverse-geocodes user city in India
  private async getRealIndianCity(): Promise<string> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return 'Delhi';
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const city = geocode[0].city || geocode[0].district || geocode[0].subregion;
        return city || 'Delhi';
      }
      return 'Delhi';
    } catch (error) {
      console.warn('Location lookup failed, defaulting to Delhi:', error);
      return 'Delhi';
    }
  }

  async fetchArticles(category: CategoryType, page: number): Promise<PaginatedResponse<FeedItem>> {
    await delay(this.networkDelayMs);

    // Dynamic pagination boundary simulation
    if (page > 3) {
      return { data: [], page, totalPages: 3, totalItems: 0 };
    }

    try {
      let rssUrl = '';
      let locationLabel = '';

      if (category === 'Local') {
        const realCity = await this.getRealIndianCity();
        locationLabel = realCity;
        // Fetch up-to-the-minute real-time local news about user city from Google News India!
        rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(realCity)}+India&hl=en-IN&gl=IN&ceid=IN:en`;
      } else if (category === 'International') {
        // Fetch global world news headlines from Google News US
        rssUrl = 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en';
      } else {
        // Map app category keys to Google News RSS Topic feeds for India
        const categoryRssMap: Record<string, string> = {
          Sports: 'SPORTS',
          Politics: 'POLITICS',
          Entertainment: 'ENTERTAINMENT',
          Business: 'BUSINESS',
          Technology: 'TECHNOLOGY',
          Health: 'HEALTH',
        };
        const topic = categoryRssMap[category] || 'NATION';
        rssUrl = `https://news.google.com/rss/headlines/section/topic/${topic}?hl=en-IN&gl=IN&ceid=IN:en`;
      }

      // Fetch direct RSS XML from Google News to avoid third party proxy caching!
      const res = await axios.get(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/xml, text/xml, */*'
        }
      });

      const rssItems = parseRssXml(res.data);
      
      // Slice for pagination (10 items per page)
      const limit = 10;
      const start = (page - 1) * limit;
      const slicedItems = rssItems.slice(start, start + limit);

      const fallbacks = HIGH_RES_FALLBACK_IMAGES[category] || HIGH_RES_FALLBACK_IMAGES.Local;

      const feedItems: FeedItem[] = slicedItems.map((item: any, index: number) => {
        const itemIndex = start + index;
        const baseId = `live-${category}-${page}-${itemIndex}`;
        const likes = Math.floor(Math.random() * 250) + 20;
        const views = likes * (Math.floor(Math.random() * 5) + 4);
        const commentsCount = Math.floor(likes / 4);

        // Google News RSS titles are formatted as "Headline - Publisher Name"
        const titleRaw = item.title || 'Hyperlocal Bulletin Update';
        const dashIndex = titleRaw.lastIndexOf(' - ');
        
        let headline = titleRaw;
        let sourceName = item.sourceName || 'Local Pulse';

        if (dashIndex !== -1) {
          headline = titleRaw.substring(0, dashIndex);
          if (!sourceName || sourceName === 'News Source' || sourceName === 'Local Pulse') {
            sourceName = titleRaw.substring(dashIndex + 3);
          }
        }

        let content = item.description || 'Hyperlocal incident detail report. The municipal corporation has initiated review meetings regarding local developments.';

        if (category === 'Local' && locationLabel) {
          content = `[Live Coverage in ${locationLabel}] ${content}\n\nLocal administrative council members have issued an immediate safety and coordination brief for residents of ${locationLabel}. Municipal representatives are scheduling civic outreach programs this weekend to outline public support channels. All citizens of ${locationLabel} are invited to participate.`;
          sourceName = `${locationLabel} Bulletin`;
        }

        // sponsored card insertion at index 3
        if (index === 3) {
          return {
            id: `ad-${baseId}`,
            type: 'ad',
            data: {
              id: `ad-${baseId}`,
              title: category === 'Local' ? `EcoPower Solar ${locationLabel} Branch` : 'Switch to EcoPower Solar',
              description: 'Get $0 down solar installation for residential properties. Join 5,000+ families saving on monthly bills.',
              image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
              sponsorName: 'EcoPower Solar Inc.',
              ctaUrl: 'https://example.com/ecopower',
            },
          };
        }

        // event card insertion at index 7
        if (index === 7) {
          return {
            id: `event-${baseId}`,
            type: 'event',
            data: {
              id: `event-${baseId}`,
              title: category === 'Local' ? `${locationLabel} Community Expo 2026` : `Annual ${category} Expo 2026`,
              description: 'Join local merchants, builders, and neighbors. Food trucks, local performances, and children activities provided.',
              image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
              date: 'Saturday, June 20 at 10:00 AM',
              location: category === 'Local' ? `${locationLabel} Civic Exhibition Hall B` : 'Civic Exhibition Center, Hall B',
              ctaLabel: 'Register Free',
            },
          };
        }

        // Assign parsed live thumbnail from Google News, or fall back to high-res category curated images
        const thumbnail = item.thumbnail || fallbacks[itemIndex % fallbacks.length];

        return {
          id: baseId,
          type: 'news',
          data: {
            id: baseId,
            title: headline.length > 80 ? `${headline.substring(0, 77)}...` : headline,
            content: content,
            thumbnail,
            source: sourceName,
            timestamp: new Date(item.pubDate || Date.now()).getTime(),
            category,
            likes,
            views,
            commentsCount,
          },
        };
      });

      return {
        data: feedItems,
        page,
        totalPages: Math.ceil(rssItems.length / limit) || 1,
        totalItems: rssItems.length,
      };
    } catch (error) {
      console.error('Failed to fetch real-time news articles:', error);
      return {
        data: [],
        page,
        totalPages: 1,
        totalItems: 0,
      };
    }
  }

  async fetchComments(articleId: string, page: number): Promise<PaginatedResponse<Comment>> {
    await delay(100);
    const allComments = generateMockComments(articleId, 15);
    const limit = 5;
    const start = (page - 1) * limit;
    const paginated = allComments.slice(start, start + limit);

    return {
      data: paginated,
      page,
      totalPages: Math.ceil(allComments.length / limit),
      totalItems: allComments.length,
    };
  }

  async addComment(articleId: string, commentText: string): Promise<Comment> {
    await delay(200);
    if (!commentText.trim()) {
      throw new Error('Comment text cannot be empty');
    }
    return {
      id: `comment-new-${Date.now()}`,
      articleId,
      authorName: 'You (Local Citizen)',
      authorAvatar: 'https://ui-avatars.com/api/?name=You&background=06B6D4&color=fff',
      content: commentText,
      timestamp: Date.now(),
    };
  }
}
