import { FeedItem, Comment, CategoryType } from '../types';

export const MOCK_CATEGORIES: CategoryType[] = [
  'Local',
  'Sports',
  'Politics',
  'Entertainment',
  'Business',
  'Technology',
  'Health',
];

// Helper to generate comments
export const generateMockComments = (articleId: string, count: number = 10): Comment[] => {
  const authors = [
    'Sarah Jenkins',
    'Marcus Thompson',
    'Elena Rostova',
    'David Chen',
    'Aisha Diop',
    'Carlos Martinez',
    'Emily Taylor',
    'Jordan Smith',
  ];
  
  const commentsList = [
    'This is a crucial update for our community. Thanks for reporting!',
    'Does anyone know if the city hall is offering virtual townhall sessions for this?',
    'I was there yesterday, the traffic detour signs are very confusing. Drive safely!',
    'Finally! We have been demanding this neighborhood improvement for years.',
    'I hope they address the environmental impact of this proposal soon.',
    'Amazing photos. The photographer captured the neighborhood spirit beautifully.',
    'Can someone verify if this applies to small businesses outside the main district?',
    'Great coverage! I hope the local council reads this and takes immediate action.',
  ];

  return Array.from({ length: count }).map((_, index) => {
    const author = authors[index % authors.length];
    const content = commentsList[index % commentsList.length];
    return {
      id: `${articleId}-comment-${index + 1}`,
      articleId,
      authorName: author,
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=312E81&color=fff`,
      content,
      timestamp: Date.now() - index * 3600000 - Math.random() * 1800000,
    };
  });
};

// Main Mock Feed Data keyed by category
export const generateMockFeed = (category: CategoryType, page: number = 1): FeedItem[] => {
  const baseTimestamp = Date.now();
  const items: FeedItem[] = [];

  // Generate 8 articles, 1 ad, and 1 event per page for the feed list
  if (page > 3) return []; // Limit mocks to 3 pages for realistic paging limits

  const pageOffset = (page - 1) * 10;

  // Let's create category-specific titles
  const categoryHeadlines: Record<CategoryType, string[]> = {
    Local: [
      'New Downtown Community Park Set to Open Next Saturday',
      'Local Business Owners Protest New Parking Regulations',
      'Oakwood High School Wins Regional Science Fair Championship',
      'Annual Neighborhood Block Party Rescheduled Due to Rain',
      'City Council Approves $5M Green Energy Transit Grant',
      'Historic Theater Receives Heritage Restoration Funding',
      'Volunteers Plant Over 500 Trees in Urban Forestry Drive',
      'Metro Fire Station Announces Open House and Safety Seminars',
    ],
    Sports: [
      'Metro City FC Clinches Thrilling 3-2 Victory Over Rivals',
      'High School Quarterback Signs National Division-1 Letter',
      'Local Marathon Raising Over $50K for Childrens Hospital',
      'Community Sports Center Launches Under-14 Soccer League',
      'Gymnastics Champion Hosts Youth Workshop at Civic Center',
      'Downtown Basketball Courts Get Complete Modern Facelift',
      'Metro Tennis Open Features Top Regional Seeds Next Month',
      'Cyclist Group Advocates for Safer Mountain Bike Trails',
    ],
    Politics: [
      'Mayoral Candidates Agree to Live Broadcast Televised Debate',
      'City Approves Landmark Affordable Housing Rezoning Scheme',
      'Public Transport Subsidies Approved by Finance Committee',
      'New Waste Management Policy Stirs Hot Debate at City Hall',
      'Mayor Announces Task Force to Combat Neighborhood Noise',
      'Local Ward Election Sees Record-Breaking Voter Turnout',
      'Community Advocates Petition for Enhanced Crosswalk Safety',
      'Council Votes to Increase Funding for Public Libraries',
    ],
    Entertainment: [
      'Summer Music Festival Unveils Star-Studded Local Lineup',
      'Local Director Wins Top Prize at Independent Film Festival',
      'Art Gallery Features Stunning Street Art Glass Showcase',
      'Community Theater Announces Auditions for Upcoming Musical',
      'Popular Downtown Food Truck Rally Returns This Weekend',
      'Jazz Night at the Blue Note Cafe Celebrates 10th Anniversary',
      'Symphony Orchestra Offers Free Concerts in the Park',
      'Local Author Tops National Best-Seller List with New Thriller',
    ],
    Business: [
      'Tech Hub Startup Incubator Launches in Revitalized District',
      'Farmers Market Reports Record Sales Season, Eyes Expansion',
      'Independent Bookstore Expands into Cozy Cafe Integration',
      'Co-Working Space Opens in Heart of Historic Warehouse Ward',
      'Boutique Hotel Redevelopment Project Cleared for Launch',
      'Craft Brewery Announces 30 New Jobs in Production Expansion',
      'Organic Grocery Coop Celebrates Grand Opening This Morning',
      'Chamber of Commerce Hosts Annual Small Business Gala Dinner',
    ],
    Technology: [
      'Smart City Traffic Grid Trial Reduces Commutes by 15 Percent',
      'Local Students Build Award-Winning Solar Robotics Vehicle',
      'Coding Bootcamp Partners with Community College for Scholarships',
      'Library Launches High-Tech VR Learning Center for Youth',
      'Cybersecurity Firm Warns Against Hyperlocal Phishing Scams',
      'E-Waste Recycling Event Aims to Divert 10 Tons from Landfills',
      'Local App Developers Launch Municipal Parking Finder Service',
      'Makerspace Hosts Free Arduino Workshops for Middle Schools',
    ],
    Health: [
      'New Hyperlocal Health Center Opens in Underserved Ward',
      'Mobile Dental Clinic Expands Schedule to Remote Neighborhoods',
      'Community Wellness Fair Offers Free Cardiovascular Screenings',
      'Local Experts Share Crucial Tips for High-Pollen Season',
      'Municipal Pool Launches Low-Impact Water Aerobics Classes',
      'Mental Health Support Group Begins Weekly Library Meetings',
      'Organic Rooftop Farms Supply Fresh Produce to Senior Centers',
      'Nutritionists Host Cooking Classes Focused on Budget Meals',
    ],
  };

  const headlines = categoryHeadlines[category] || categoryHeadlines.Local;

  // Render 10 items
  for (let i = 0; i < 10; i++) {
    const itemIndex = pageOffset + i;
    const timestamp = baseTimestamp - itemIndex * 7200000; // 2 hour gaps

    if (i === 3) {
      // Sponsored Advertisement Card
      items.push({
        id: `ad-${category}-${page}-${itemIndex}`,
        type: 'ad',
        data: {
          id: `ad-${category}-${page}-${itemIndex}`,
          title: 'Switch to EcoPower Solar',
          description: 'Get $0 down installation for local residential buildings. Join 5,000+ local families saving on monthly energy bills.',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
          sponsorName: 'EcoPower Solar Inc.',
          ctaUrl: 'https://example.com/ecopower',
        },
      });
    } else if (i === 7) {
      // Local Community Event Card
      items.push({
        id: `event-${category}-${page}-${itemIndex}`,
        type: 'event',
        data: {
          id: `event-${category}-${page}-${itemIndex}`,
          title: `Annual ${category} Community Expo 2026`,
          description: 'Join local enthusiasts, experts, and vendors. Food trucks, family-friendly workshops, and live entertainment are provided.',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
          date: 'Saturday, June 20 at 10:00 AM',
          location: 'Civic Exhibition Center, Hall B',
          ctaLabel: 'Register Free',
        },
      });
    } else {
      // News Card
      const headlineIndex = (itemIndex) % headlines.length;
      const headline = headlines[headlineIndex];
      const likes = Math.floor(Math.random() * 200) + 10;
      const views = likes * (Math.floor(Math.random() * 5) + 3);
      const commentsCount = Math.floor(likes / 4);

      // Unsplash topic-based images
      const imageUrls: Record<CategoryType, string[]> = {
        Local: [
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=600&auto=format&fit=crop',
        ],
        Sports: [
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop',
        ],
        Politics: [
          'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop',
        ],
        Entertainment: [
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
        ],
        Business: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
        ],
        Technology: [
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
        ],
        Health: [
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop',
        ],
      };
      
      const images = imageUrls[category] || imageUrls.Local;
      const thumbnail = images[itemIndex % images.length];

      items.push({
        id: `news-${category}-${page}-${itemIndex}`,
        type: 'news',
        data: {
          id: `news-${category}-${page}-${itemIndex}`,
          title: headline,
          content: `In a major development for the city, this issue has become a key point of discussion among local residents and authorities. Analysts note that this move marks a significant transition in how public assets and community programs are funded. Many argue that the local administration should have engaged more heavily with community leaders before making the decision.

Local citizen groups are already organizing forums to discuss the implications. "This is not just about the immediate changes; it's about the kind of city we want to build for the next generation," remarked local spokesperson Arthur Vance during a press briefing yesterday. 

The implementation will take place over several phases, beginning next month. Municipal authorities have pledged to set up a dedicated communication channel to capture feedback and address neighborhood concerns. Residents are encouraged to participate in upcoming townhall meetings to express their views directly to the developers and council members.`,
          thumbnail,
          source: 'City Herald',
          timestamp,
          category,
          likes,
          views,
          commentsCount,
        },
      });
    }
  }

  return items;
};
