import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../core/theme';

export const NewsFeedSkeleton: React.FC = () => {
  const theme = useAppTheme();
  const opacity = useSharedValue(0.3);

  // High-performance Reanimated pulsing loop
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 800 }), -1, true);
  }, [opacity]);

  const skeletonItems = Array.from({ length: 4 });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {skeletonItems.map((_, index) => (
        <Animated.View
          key={`skeleton-card-${index}`}
          style={[
            styles.skeletonCard,
            {
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.border,
              ...theme.shadows.light,
            },
            animatedStyle,
          ]}
        >
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />
          
          <View style={styles.textContainer}>
            <View style={styles.metaRow}>
              <View style={[styles.metaPlaceholder, { width: 60, backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />
              <View style={[styles.metaPlaceholder, { width: 40, backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />
            </View>

            <View style={[styles.linePlaceholder, { width: '90%', backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />
            <View style={[styles.linePlaceholder, { width: '70%', backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />

            <View style={styles.footerPlaceholder}>
              <View style={[styles.metaPlaceholder, { width: 50, backgroundColor: theme.dark ? '#334155' : '#E2E8F0' }]} />
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  skeletonCard: {
    flexDirection: 'row',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 90,
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPlaceholder: {
    height: 12,
    borderRadius: 4,
  },
  linePlaceholder: {
    height: 14,
    borderRadius: 4,
    marginVertical: 2,
  },
  footerPlaceholder: {
    flexDirection: 'row',
  },
});

export default NewsFeedSkeleton;
