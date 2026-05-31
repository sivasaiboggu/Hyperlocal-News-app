import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../core/theme';

export const OfflineBanner: React.FC = () => {
  const theme = useAppTheme();
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const translateY = useSharedValue(-50); // Starts hidden offscreen

  // Network listening emulation (Simulated offline trigger for custom environments)
  useEffect(() => {
    // In a real app we would use NetInfo:
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   setIsOffline(!state.isConnected);
    // });
    
    // Simulate toggling network for offline validation when USE_MOCK_DATA is active
    const timeout = setTimeout(() => {
      // Keep online by default but support testing structures
      setIsOffline(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    translateY.value = withTiming(isOffline ? 0 : -50, { duration: 300 });
  }, [isOffline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isOffline) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: theme.colors.error, ...theme.shadows.medium },
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, { ...theme.typography.caption }]}>
        OFFLINE MODE — RUNNING ON LOCAL CACHED ARTICLES
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default OfflineBanner;
