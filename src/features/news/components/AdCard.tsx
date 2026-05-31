import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AdContent } from '../../../core/types';
import { useAppTheme } from '../../../core/theme';

interface AdCardProps {
  ad: AdContent;
}

export const AdCard: React.FC<AdCardProps> = React.memo(({ ad }) => {
  const theme = useAppTheme();

  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(ad.ctaUrl);
      if (supported) {
        await Linking.openURL(ad.ctaUrl);
      }
    } catch (error) {
      console.error('Failed to open ad link:', error);
    }
  };

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: theme.dark ? '#1A2436' : '#FFFBEB', // Subtle amber warm tint
          borderColor: theme.dark ? '#4F3E22' : '#FDE68A', // Warm amber borders
          ...theme.shadows.light,
        },
      ]}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel={`Sponsored Advertisement: ${ad.title} by ${ad.sponsorName}. ${ad.description}. Double tap to visit sponsor website.`}
    >
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: theme.colors.warning }]}>
          <Text style={styles.badgeText}>SPONSORED</Text>
        </View>
        <Text style={[styles.sponsorName, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
          {ad.sponsorName}
        </Text>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h3 }]} numberOfLines={2}>
            {ad.title}
          </Text>
          <Text style={[styles.desc, { color: theme.colors.textSecondary, ...theme.typography.bodySmall }]} numberOfLines={3}>
            {ad.description}
          </Text>
        </View>
        <FastImage
          style={styles.image}
          source={{
            uri: ad.image,
            priority: FastImage.priority.low,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.dark ? '#334155' : '#FEF3C7' }]} />
      
      <Text style={[styles.ctaText, { color: theme.colors.primary, ...theme.typography.button }]}>
        Learn More at {ad.sponsorName} →
      </Text>
    </Pressable>
  );
});

AdCard.displayName = 'AdCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sponsorName: {
    fontWeight: '700',
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    lineHeight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  ctaText: {
    textAlign: 'right',
    fontWeight: '700',
  },
});
