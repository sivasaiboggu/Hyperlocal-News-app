import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
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

export const NewsCard: React.FC<NewsCardProps> = React.memo(({ article, onPress }) => {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

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
      <FastImage
        style={styles.image}
        source={{
          uri: article.thumbnail,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
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
