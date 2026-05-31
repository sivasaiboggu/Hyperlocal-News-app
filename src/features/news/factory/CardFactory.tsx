import React from 'react';
import { FeedItem } from '../../../core/types';
import { NewsCard } from '../components/NewsCard';
import { AdCard } from '../components/AdCard';
import { EventCard } from '../components/EventCard';

export class CardFactory {
  /**
   * Factory function that maps a typed FeedItem to its respective React visual component.
   * Eliminates scattered switch statements across feed screens and lists.
   */
  static createCard(
    item: FeedItem,
    onPressNews: (articleId: string) => void
  ): React.ReactElement {
    switch (item.type) {
      case 'news':
        return <NewsCard article={item.data} onPress={onPressNews} />;
      case 'ad':
        return <AdCard ad={item.data} />;
      case 'event':
        return <EventCard event={item.data} />;
      default:
        // Exhaustive TypeScript type checking fallback
        const exhaustiveCheck: never = item;
        throw new Error(`[CardFactory] Unknown feed item type: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}
export default CardFactory;
