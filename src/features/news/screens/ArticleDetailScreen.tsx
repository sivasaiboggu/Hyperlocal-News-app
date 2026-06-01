import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ArticleDetailScreenRouteProp, RootStackParamList } from '../../../core/navigation/types';
import { useAppTheme } from '../../../core/theme';
import { selectArticleById, selectCurrentFeedItems } from '../store/newsSlice';
import { useComments } from '../hooks/useComments';
import { formatRelativeTime } from '../../../core/utils/time';
import { Comment, NewsArticle } from '../../../core/types';

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

export const ArticleDetailScreen: React.FC = () => {
  const theme = useAppTheme();
  const route = useRoute<ArticleDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { articleId } = route.params;

  const article = useSelector(selectArticleById(articleId));
  const currentFeedItems = useSelector(selectCurrentFeedItems);

  const fallbackUrl = React.useMemo(() => {
    if (!article) return '';
    return getFallbackImage(article.id, article.category);
  }, [article?.id, article?.category]);

  const [imgSrc, setImgSrc] = React.useState<string>(() => {
    if (!article) return '';
    const uri = article.thumbnail ? article.thumbnail.trim() : '';
    if (!uri || uri.startsWith('//') || uri.includes('pixel') || uri.includes('analytics') || uri.includes('logo') || uri.includes('favicon')) {
      return getFallbackImage(article.id, article.category);
    }
    return uri;
  });

  React.useEffect(() => {
    if (article) {
      const uri = article.thumbnail ? article.thumbnail.trim() : '';
      if (!uri || uri.startsWith('//') || uri.includes('pixel') || uri.includes('analytics') || uri.includes('logo') || uri.includes('favicon')) {
        setImgSrc(fallbackUrl);
      } else {
        setImgSrc(uri);
      }
    }
  }, [article?.thumbnail, fallbackUrl]);

  // Hook managing paginated comments and optimistic posting
  const {
    comments,
    loading,
    pagination,
    isSubmitting,
    fetchNextCommentsPage,
    submitComment,
  } = useComments(articleId);

  const [commentText, setCommentText] = useState('');

  if (!article) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Article not found.
        </Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.colors.accent }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Gets related articles in the same category (excluding current)
  const relatedArticles = currentFeedItems
    .filter((item) => item.type === 'news' && item.id !== articleId)
    .slice(0, 3)
    .map((item) => item.data as NewsArticle);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    const typedText = commentText;
    setCommentText(''); // Clear input instantly

    try {
      await submitComment(typedText);
    } catch (err: any) {
      setCommentText(typedText); // Restore on failure for user convenience
      Alert.alert('Unable to Post', err.message || 'Check your internet connection.');
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => {
    const isTemp = item.id.startsWith('comment-optimistic-');
    return (
      <View
        style={[
          styles.commentCard,
          {
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.border,
            opacity: isTemp ? 0.6 : 1, // Visual hint for pending optimistic writes
          },
        ]}
      >
        <Image
          style={styles.avatar}
          source={{
            uri: item.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.authorName)}`,
          }}
          resizeMode="cover"
        />
        <View style={styles.commentContent}>
          <View style={styles.commentMeta}>
            <Text style={[styles.authorName, { color: theme.colors.textPrimary, ...theme.typography.bodySmall, fontWeight: '700' }]}>
              {item.authorName}
            </Text>
            <Text style={[styles.commentTime, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
              {formatRelativeTime(item.timestamp)}
            </Text>
          </View>
          <Text style={[styles.commentBody, { color: theme.colors.textPrimary, ...theme.typography.bodyMedium }]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  // Heavy header containing full Article Body + Related News + Comments Inputs
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Hero Image */}
        <Image
          style={styles.heroImage}
          source={{
            uri: imgSrc,
          }}
          resizeMode="cover"
          onError={() => {
            setImgSrc(fallbackUrl);
          }}
        />

        <View style={styles.paddingContainer}>
          <View style={styles.metaRow}>
            <Text style={[styles.tag, { color: theme.colors.accent, ...theme.typography.caption }]}>
              {article.category.toUpperCase()}
            </Text>
            <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>•</Text>
            <Text style={[styles.sourceText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
              {article.source}
            </Text>
            <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>•</Text>
            <Text style={[styles.timeText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
              {formatRelativeTime(article.timestamp)}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h1 }]}>
            {article.title}
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Body content split into paragraphs for beautiful typography */}
          {article.content.split('\n\n').map((para, idx) => (
            <Text
              key={`p-${idx}`}
              style={[
                styles.paragraph,
                { color: theme.colors.textPrimary, ...theme.typography.bodyLarge },
              ]}
            >
              {para}
            </Text>
          ))}

          {/* Related Articles Panel */}
          {relatedArticles.length > 0 && (
            <View style={styles.relatedPanel}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                Related Stories
              </Text>
              {relatedArticles.map((rel) => (
                <Pressable
                  key={rel.id}
                  style={[styles.relatedItem, { borderColor: theme.colors.border }]}
                  onPress={() => (navigation.navigate as any)('ArticleDetail', { articleId: rel.id })}
                >
                  <Text style={[styles.relatedHeadline, { color: theme.colors.textPrimary, ...theme.typography.bodyMedium }]}>
                    {rel.title}
                  </Text>
                  <Text style={[styles.relatedMeta, { color: theme.colors.accent, ...theme.typography.caption }]}>
                    {rel.source} • {formatRelativeTime(rel.timestamp)}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: theme.colors.border, marginVertical: 24 }]} />

          {/* Comments Composer */}
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h2 }]}>
            Community Discussions ({comments.length})
          </Text>

          <View style={styles.commentInputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.textPrimary,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Join the local conversation..."
              placeholderTextColor={theme.colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={200}
            />
            <Pressable
              style={({ pressed }) => [
                styles.postBtn,
                {
                  backgroundColor: commentText.trim()
                    ? pressed
                      ? theme.colors.primary + 'AA'
                      : theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              disabled={!commentText.trim() || isSubmitting}
              onPress={handlePostComment}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.postText, { ...theme.typography.button, color: '#FFFFFF' }]}>Post</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    const hasMore = pagination.page < pagination.totalPages;
    
    if (loading && comments.length > 0) {
      return (
        <View style={styles.commentsLoader}>
          <ActivityIndicator size="small" color={theme.colors.accent} />
        </View>
      );
    }

    if (hasMore && comments.length > 0) {
      return (
        <Pressable
          style={[styles.loadMoreBtn, { borderColor: theme.colors.accent }]}
          onPress={fetchNextCommentsPage}
        >
          <Text style={[styles.loadMoreText, { color: theme.colors.accent, ...theme.typography.button }]}>
            Load More Comments
          </Text>
        </Pressable>
      );
    }

    return <View style={{ height: 40 }} />;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
  },
  backBtn: {
    padding: 10,
  },
  listContent: {
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  paddingContainer: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tag: {
    fontWeight: '800',
  },
  bullet: {
    marginHorizontal: 8,
  },
  sourceText: {
    fontWeight: '700',
  },
  timeText: {},
  title: {
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  paragraph: {
    lineHeight: 28,
    marginBottom: 20,
    fontWeight: '400',
  },
  relatedPanel: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 16,
  },
  relatedItem: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  relatedHeadline: {
    fontWeight: '700',
    marginBottom: 4,
  },
  relatedMeta: {
    fontWeight: '600',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 48,
    maxHeight: 100,
    fontSize: 14,
  },
  postBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postText: {
    fontWeight: '700',
  },
  commentCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorName: {
    fontWeight: '700',
  },
  commentTime: {},
  commentBody: {
    lineHeight: 20,
  },
  commentsLoader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreBtn: {
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 40,
    marginVertical: 16,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreText: {
    fontWeight: '700',
  },
});

export default ArticleDetailScreen;
