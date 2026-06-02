import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor, RootState } from './src/features/news/store';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { lightTheme, darkTheme } from './src/core/theme';

function AppContent() {
  const themeMode = useSelector((state: RootState) => state.news?.themeMode || 'light');
  const activeTheme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDark = activeTheme.dark;

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: darkTheme.colors.primary,
          background: darkTheme.colors.background,
          card: darkTheme.colors.surface,
          text: darkTheme.colors.textPrimary,
          border: darkTheme.colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: lightTheme.colors.primary,
          background: lightTheme.colors.background,
          card: lightTheme.colors.surface,
          text: lightTheme.colors.textPrimary,
          border: lightTheme.colors.border,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
