import React, { useRef, useEffect } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CategoryType } from '../../../core/types';
import { useAppTheme } from '../../../core/theme';

interface CategorySliderProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 105; // Spaced beautifully
const UNDERLINE_WIDTH = 48;
const START_PADDING = 16;

export const CategorySlider: React.FC<CategorySliderProps> = React.memo(
  ({ categories, selectedCategory, onSelectCategory }) => {
    const theme = useAppTheme();
    const scrollViewRef = useRef<ScrollView>(null);

    const activeIndex = categories.indexOf(selectedCategory);

    // Shared animated value for the gliding underline offset
    const indicatorTranslateX = useSharedValue(
      START_PADDING + (activeIndex !== -1 ? activeIndex : 0) * ITEM_WIDTH + (ITEM_WIDTH - UNDERLINE_WIDTH) / 2
    );

    useEffect(() => {
      if (activeIndex !== -1) {
        // Glides the underline smoothly with spring physics
        indicatorTranslateX.value = withSpring(
          START_PADDING + activeIndex * ITEM_WIDTH + (ITEM_WIDTH - UNDERLINE_WIDTH) / 2,
          { damping: 16, stiffness: 140 }
        );

        // Centers the selected tab in the viewport
        if (scrollViewRef.current) {
          const targetOffset = START_PADDING + activeIndex * ITEM_WIDTH - SCREEN_WIDTH / 2 + ITEM_WIDTH / 2;
          scrollViewRef.current.scrollTo({
            x: Math.max(0, targetOffset),
            y: 0,
            animated: true,
          });
        }
      }
    }, [activeIndex, indicatorTranslateX]);

    const animatedUnderlineStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: indicatorTranslateX.value }],
    }));

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: START_PADDING,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Shared Gliding Underline */}
          <Animated.View
            style={[
              styles.underline,
              { backgroundColor: theme.colors.accent },
              animatedUnderlineStyle,
            ]}
          />

          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <CategoryItem
                key={category}
                category={category}
                isActive={isActive}
                onPress={() => onSelectCategory(category)}
                theme={theme}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

CategorySlider.displayName = 'CategorySlider';

interface CategoryItemProps {
  category: CategoryType;
  isActive: boolean;
  onPress: () => void;
  theme: any;
}

const CategoryItem: React.FC<CategoryItemProps> = React.memo(({ category, isActive, onPress, theme }) => {
  const textScale = useSharedValue(isActive ? 1.08 : 1);
  const textOpacity = useSharedValue(isActive ? 1 : 0.65);

  useEffect(() => {
    textScale.value = withSpring(isActive ? 1.08 : 1, { damping: 15, stiffness: 180 });
    textOpacity.value = withSpring(isActive ? 1 : 0.65, { damping: 15, stiffness: 180 });
  }, [isActive, textScale, textOpacity]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
    opacity: textOpacity.value,
  }));

  return (
    <Pressable
      style={styles.itemWrapper}
      onPress={onPress}
      accessible={true}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Category Tab: ${category}. ${isActive ? 'Currently Active' : 'Tap to select'}`}
    >
      <Animated.Text
        style={[
          styles.text,
          {
            color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
            fontWeight: isActive ? '800' : '600',
            fontSize: 14,
            fontFamily: theme.typography.bodyLarge.fontFamily,
          },
          animatedTextStyle,
        ]}
      >
        {category}
      </Animated.Text>
    </Pressable>
  );
});

CategoryItem.displayName = 'CategoryItem';

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  itemWrapper: {
    width: ITEM_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: 2,
    width: UNDERLINE_WIDTH,
    height: 3.5,
    borderRadius: 2,
  },
});

