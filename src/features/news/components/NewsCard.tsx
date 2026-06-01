import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { NewsArticle } from '../../../core/types';
import { useAppTheme } from '../../../core/theme';
import { formatRelativeTime } from '../../../core/utils/time';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NewsCardProps {
  article: NewsArticle;
  onPress: (articleId: string) => void;
}

const FALLBACK_IMAGES: Record<string, string[]> = {
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

const getFallbackImage = (articleId: string, category: string): string => {
  const fallbacks = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.Local;
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    hash = articleId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbacks.length;
  return fallbacks[index];
};

export const NewsCard: React.FC<NewsCardProps> = React.memo(({ article, onPress }) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const fallbackUrl = React.useMemo(() => {
    return getFallbackImage(article.id, article.category);
  }, [article.id, article.category]);

  const [imgSrc, setImgSrc] = React.useState<string>(() => {
    const uri = article.thumbnail ? article.thumbnail.trim() : '';
    if (!uri || uri.startsWith('//') || uri.includes('pixel') || uri.includes('analytics') || uri.includes('logo') || uri.includes('favicon')) {
      return fallbackUrl;
    }
    return uri;
  });

  React.useEffect(() => {
    const uri = article.thumbnail ? article.thumbnail.trim() : '';
    if (!uri || uri.startsWith('//') || uri.includes('pixel') || uri.includes('analytics') || uri.includes('logo') || uri.includes('favicon')) {
      setImgSrc(fallbackUrl);
    } else {
      setImgSrc(uri);
    }
  }, [article.thumbnail, fallbackUrl]);

  // Smooth Reanimated Spring scale effect on tap
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  // Enforces the 80 character limit with trailing ellipsis
  const formattedTitle =
    article.title.length > 80 ? `${article.title.substring(0, 77)}...` : article.title;

  return (
    <AnimatedPressable
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
          ...theme.shadows.light,
        },
        animatedStyle,
      ]}
      onPress={() => onPress(article.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`News Article: ${article.title}. Published by ${article.source} ${formatRelativeTime(
        article.timestamp
      )}. Tap to read full story.`}
    >
      <Image
        style={styles.image}
        source={{
          uri: imgSrc,
        }}
        resizeMode="cover"
        onError={() => {
          setImgSrc(fallbackUrl);
        }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.metaRow}>
          <Text style={[styles.categoryTag, { color: theme.colors.accent, ...theme.typography.caption }]}>
            {article.category.toUpperCase()}
          </Text>
          <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>•</Text>
          <Text style={[styles.sourceText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            {article.source}
          </Text>
        </View>
        
        <Text
          style={[styles.headline, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}
          numberOfLines={3}
        >
          {formattedTitle}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.timeText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            {formatRelativeTime(article.timestamp)}
          </Text>
          <View style={styles.statsContainer}>
            <Text style={[styles.statText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
              {article.views} Views
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
});

NewsCard.displayName = 'NewsCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    minHeight: 120,
  },
  image: {
    width: 110,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTag: {
    fontWeight: '700',
  },
  bullet: {
    marginHorizontal: 6,
    fontSize: 8,
  },
  sourceText: {
    fontWeight: '600',
  },
  headline: {
    marginVertical: 4,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {},
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontWeight: '500',
  },
});
