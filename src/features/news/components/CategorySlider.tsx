import React, { useRef, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
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
const ITEM_WIDTH = 110; // Fixed width for clean snaps and paging alignments

export const CategorySlider: React.FC<CategorySliderProps> = React.memo(
  ({ categories, selectedCategory, onSelectCategory }) => {
    const theme = useAppTheme();
    const flatListRef = useRef<FlatList<CategoryType>>(null);

    // Side effect to auto-center the active category item when selected
    useEffect(() => {
      const activeIndex = categories.indexOf(selectedCategory);
      if (activeIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewPosition: 0.5, // Centers the item in horizontal frame
        });
      }
    }, [selectedCategory, categories]);

    const renderItem = ({ item, index }: { item: CategoryType; index: number }) => {
      const isActive = item === selectedCategory;
      return (
        <CategoryItem
          item={item}
          isActive={isActive}
          onPress={() => onSelectCategory(item)}
          theme={theme}
        />
      );
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <FlatList
          ref={flatListRef}
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          // Offsets so the first/last items can center perfectly with partial items visible on edges
          contentContainerStyle={{
            paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
            alignItems: 'center',
          }}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />
      </View>
    );
  }
);

CategorySlider.displayName = 'CategorySlider';

// Specialized individual category item with smooth scale & spring transitions
interface CategoryItemProps {
  item: CategoryType;
  isActive: boolean;
  onPress: () => void;
  theme: any;
}

const CategoryItem: React.FC<CategoryItemProps> = React.memo(({ item, isActive, onPress, theme }) => {
  const underlineScaleX = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    underlineScaleX.value = withSpring(isActive ? 1 : 0, { damping: 15, stiffness: 180 });
  }, [isActive, underlineScaleX]);

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: underlineScaleX.value }],
  }));

  return (
    <Pressable
      style={styles.itemWrapper}
      onPress={onPress}
      accessible={true}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Category Tab: ${item}. ${isActive ? 'Currently Active' : 'Tap to select'}`}
    >
      <Text
        style={[
          styles.text,
          {
            color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
            fontWeight: isActive ? '700' : '500',
            fontSize: isActive ? 15 : 14,
          },
        ]}
      >
        {item}
      </Text>
      <Animated.View
        style={[
          styles.underline,
          { backgroundColor: theme.colors.accent },
          animatedUnderlineStyle,
        ]}
      />
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
    position: 'relative',
  },
  text: {
    textAlign: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: 2,
    width: 48,
    height: 3,
    borderRadius: 2,
  },
});
