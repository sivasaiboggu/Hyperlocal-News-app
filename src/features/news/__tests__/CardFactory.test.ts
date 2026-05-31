import React from 'react';
import { CardFactory } from '../factory/CardFactory';
import { FeedItem } from '../../../core/types';
import { NewsCard } from '../components/NewsCard';
import { AdCard } from '../components/AdCard';
import { EventCard } from '../components/EventCard';

// Mock the nested React Components to prevent rendering issues during unit checks
jest.mock('../components/NewsCard', () => {
  return { NewsCard: () => 'NewsCardComponent' };
});
jest.mock('../components/AdCard', () => {
  return { AdCard: () => 'AdCardComponent' };
});
jest.mock('../components/EventCard', () => {
  return { EventCard: () => 'EventCardComponent' };
});

describe('CardFactory Design Pattern Mappings', () => {
  const mockOnPress = jest.fn();

  it('should instantiate and return NewsCard element when item type is news', () => {
    const item: FeedItem = {
      id: 'news-1',
      type: 'news',
      data: {
        id: 'news-1',
        title: 'Headline Test',
        content: '...',
        thumbnail: 'https://...',
        source: 'City Daily',
        timestamp: Date.now(),
        category: 'Local',
        likes: 1,
        views: 1,
        commentsCount: 0,
      },
    };

    const element = CardFactory.createCard(item, mockOnPress);
    expect(element.type).toBe(NewsCard);
  });

  it('should instantiate and return AdCard element when item type is ad', () => {
    const item: FeedItem = {
      id: 'ad-1',
      type: 'ad',
      data: {
        id: 'ad-1',
        title: 'Solar Promo',
        description: '...',
        image: 'https://...',
        sponsorName: 'Solar Co.',
        ctaUrl: 'https://...',
      },
    };

    const element = CardFactory.createCard(item, mockOnPress);
    expect(element.type).toBe(AdCard);
  });

  it('should instantiate and return EventCard element when item type is event', () => {
    const item: FeedItem = {
      id: 'event-1',
      type: 'event',
      data: {
        id: 'event-1',
        title: 'Summer Fest',
        description: '...',
        image: 'https://...',
        date: 'June 20',
        location: 'Park',
        ctaLabel: 'Register',
      },
    };

    const element = CardFactory.createCard(item, mockOnPress);
    expect(element.type).toBe(EventCard);
  });

  it('should throw exhaustive type error when encountering an unmapped feed item type', () => {
    const badItem = {
      id: 'bad-1',
      type: 'unknown_type',
      data: {},
    } as unknown as FeedItem;

    expect(() => CardFactory.createCard(badItem, mockOnPress)).toThrow(
      '[CardFactory] Unknown feed item type'
    );
  });
});
