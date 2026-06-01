import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  NewsFeed: undefined;
  ArticleDetail: { articleId: string };
};

export type NewsFeedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewsFeed'
>;

export type ArticleDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ArticleDetail'
>;

export type ArticleDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ArticleDetail'
>;
