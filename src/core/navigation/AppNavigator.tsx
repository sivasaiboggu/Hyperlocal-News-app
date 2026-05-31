import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { NewsFeedScreen } from '../../features/news/screens/NewsFeedScreen';
import { ArticleDetailScreen } from '../../features/news/screens/ArticleDetailScreen';
import { useAppTheme } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="NewsFeed"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          ...theme.typography.h3,
        },
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: theme.colors.background },
        // Premium sliding navigation animations
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'METRO HERALD',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          title: 'Article Detail',
          headerBackTitle: 'Feed',
          // Show transparent styling or customized options
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
