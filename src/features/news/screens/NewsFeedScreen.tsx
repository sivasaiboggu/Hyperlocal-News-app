import React from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, SafeAreaView } from 'react-native';
import { FlashList } from '@shopify/shopify-flash-list';
import { useNavigation } from '@react-navigation/native';
import { NewsFeedScreenNavigationProp } from '../../../core/navigation/types';
import { useAppTheme } from '../../../core/theme';
import { useNewsFeed } from '../hooks/useNewsFeed';
import { CategoryContainer } from '../containers/CategoryContainer';
import { NewsFeedSkeleton } from '../components/NewsFeedSkeleton';
import { CardFactory } from '../factory/CardFactory';
import { OfflineBanner } from '../components/OfflineBanner';
import { FeedItem } from '../../../core/types';

export const NewsFeedScreen: React.FC = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<NewsFeedScreenNavigationProp>();
  
  // Custom Hook managing data orchestration and strategies
  const {
    feedItems,
    loading,
    error,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
  } = useNewsFeed();

  const handlePressNews = (articleId: string) => {
    navigation.navigate('ArticleDetail', { articleId });
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    return CardFactory.createCard(item, handlePressNews);
  };

  const renderFooter = () => {
    if (!loading || isRefreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.accent} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyIcon, { color: theme.colors.textSecondary }]}>📰</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          No Articles Found
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary, ...theme.typography.bodyMedium }]}>
          There are no hyperlocal updates published in this category yet.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: pressed ? theme.colors.primary + 'AA' : theme.colors.primary },
          ]}
          onPress={handleRefresh}
        >
          <Text style={[styles.retryText, { color: '#FFFFFF', ...theme.typography.button }]}>
            Check Again
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderErrorState = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: theme.colors.textPrimary, ...theme.typography.h2 }]}>
          Oops, Connection Failed
        </Text>
        <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary, ...theme.typography.bodyMedium }]}>
          {error || 'We had issues retrieving the local updates catalog.'}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: pressed ? theme.colors.primary + 'AA' : theme.colors.primary },
          ]}
          onPress={handleRefresh}
        >
          <Text style={[styles.retryText, { color: '#FFFFFF', ...theme.typography.button }]}>
            Retry Request
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <OfflineBanner />
      
      {/* Container-Presenter Category Slider Tabbar */}
      <CategoryContainer />

      {error && feedItems.length === 0 ? (
        renderErrorState()
      ) : (
        <View style={styles.listContainer}>
          {loading && feedItems.length === 0 ? (
            <NewsFeedSkeleton />
          ) : (
            <FlashList
              data={feedItems}
              renderItem={renderFeedItem}
              estimatedItemSize={140}
              keyExtractor={(item) => item.id}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  footerLoader: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontWeight: '800',
    marginBottom: 8,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    fontWeight: '700',
  },
});

export default NewsFeedScreen;
