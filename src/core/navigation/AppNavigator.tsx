import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from './types';
import { WelcomeScreen } from '../../features/news/screens/WelcomeScreen';
import { NewsFeedScreen } from '../../features/news/screens/NewsFeedScreen';
import { ArticleDetailScreen } from '../../features/news/screens/ArticleDetailScreen';
import { useAppTheme } from '../theme';
import { setThemeMode, selectThemeMode } from '../../features/news/store/newsSlice';

const Stack = createStackNavigator<RootStackParamList>();

// Custom Human-Crafted Premium Logo for Navigation Header
const HeaderLogo: React.FC = () => {
  const theme = useAppTheme();
  return (
    <View style={navStyles.logoContainer}>
      <View style={[navStyles.logoBadge, { backgroundColor: theme.colors.primary }]}>
        <Text style={navStyles.logoBadgeText}>HLN</Text>
      </View>
      <View style={navStyles.logoTextContainer}>
        <View style={navStyles.titleRow}>
          <Text style={[navStyles.brandTextPrimary, { color: theme.colors.textPrimary, fontFamily: theme.typography.h1.fontFamily }]}>
            HYPER LOCAL
          </Text>
          <View style={[navStyles.liveDot, { backgroundColor: theme.colors.accent }]} />
        </View>
        <Text style={[navStyles.brandTextSecondary, { color: theme.colors.accent }]}>
          NEWS NETWORK
        </Text>
      </View>
    </View>
  );
};

// Dynamic interactive theme switcher
const ThemeToggle: React.FC = () => {
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  const handleToggle = () => {
    if (themeMode === 'system') {
      dispatch(setThemeMode('light'));
    } else if (themeMode === 'light') {
      dispatch(setThemeMode('dark'));
    } else {
      dispatch(setThemeMode('system'));
    }
  };

  const getThemeEmoji = () => {
    if (themeMode === 'system') return '🌓';
    if (themeMode === 'light') return '☀️';
    return '🌙';
  };

  const getThemeLabel = () => {
    if (themeMode === 'system') return 'Auto';
    if (themeMode === 'light') return 'Light';
    return 'Dark';
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[
        navStyles.toggleButton,
        {
          backgroundColor: theme.colors.border,
          borderColor: theme.colors.border,
        }
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Current theme is ${themeMode}. Tap to change.`}
    >
      <Text style={navStyles.toggleEmoji}>{getThemeEmoji()}</Text>
      <Text style={[navStyles.toggleText, { color: theme.colors.textPrimary }]}>
        {getThemeLabel()}
      </Text>
    </TouchableOpacity>
  );
};

export const AppNavigator: React.FC = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
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
          ...theme.typography.h3,
          fontWeight: '800',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: theme.colors.background },
        // Premium sliding navigation animations
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: 'center',
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          title: 'Article Detail',
          headerBackTitle: 'Feed',
        }}
      />
    </Stack.Navigator>
  );
};

const navStyles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  logoTextContainer: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextPrimary: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  brandTextSecondary: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: -2,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
  },
  toggleEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default AppNavigator;
