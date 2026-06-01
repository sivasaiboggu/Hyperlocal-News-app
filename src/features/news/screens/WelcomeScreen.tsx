import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../core/navigation/types';
import { useAppTheme } from '../../../core/theme';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const theme = useAppTheme();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // Animated values for entrance and progress tracking
  const scaleValue = useSharedValue(0.4);
  const opacityValue = useSharedValue(0);
  const progressBarWidth = useSharedValue(0);

  useEffect(() => {
    // 1. Entrance animation (emblem pops up smoothly)
    scaleValue.value = withSpring(1, { damping: 14, stiffness: 80 });
    opacityValue.value = withTiming(1, { duration: 600 });

    // 2. Animate progress bar filling from 0% to 100% over 2.2 seconds
    progressBarWidth.value = withTiming(1, {
      duration: 2200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // 3. Automatic screen transition after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'NewsFeed' }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const emblemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value * 100}%`,
  }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Centered Premium Splash Branding */}
      <View style={styles.container}>
        <View style={styles.centerBox}>
          <Animated.View style={[styles.emblemContainer, emblemAnimatedStyle]}>
            <View style={[styles.logoBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.logoText}>HLN</Text>
            </View>
            <Text style={[styles.brandName, { color: theme.colors.textPrimary, fontFamily: theme.typography.h1.fontFamily }]}>
              HYPER LOCAL NEWS
            </Text>
            <Text style={[styles.brandTagline, { color: theme.colors.accent }]}>
              YOUR HYPERLOCAL NEWS NETWORK
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Loading Progress Indicator */}
        <View style={styles.footerContainer}>
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            Connecting your community...
          </Text>
          
          <View style={[styles.trackBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.fillBar,
                { backgroundColor: theme.colors.primary },
                progressAnimatedStyle,
              ]}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  trackBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default WelcomeScreen;
