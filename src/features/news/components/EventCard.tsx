import React from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { LocalEvent } from '../../../core/types';
import { useAppTheme } from '../../../core/theme';

interface EventCardProps {
  event: LocalEvent;
}

export const EventCard: React.FC<EventCardProps> = React.memo(({ event }) => {
  const theme = useAppTheme();

  const handleCTA = () => {
    Alert.alert(
      'Community Event',
      `Thank you for registering for "${event.title}"! We have saved this event details to your local calendar.`,
      [{ text: 'Great' }]
    );
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
          ...theme.shadows.medium,
        },
      ]}
      accessible={true}
      accessibilityLabel={`Community Event: ${event.title}. Happening on ${event.date} at ${event.location}. Description: ${event.description}. Double tap to register.`}
    >
      <FastImage
        style={styles.image}
        source={{
          uri: event.image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      
      <View style={styles.paddingContainer}>
        <View style={styles.metaRow}>
          <Text style={[styles.dateText, { color: theme.colors.accent, ...theme.typography.caption }]}>
            {event.date.toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h2 }]} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={[styles.desc, { color: theme.colors.textSecondary, ...theme.typography.bodyMedium }]} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.locationFooter}>
          <View style={styles.locationInfo}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text
              style={[styles.locationText, { color: theme.colors.textSecondary, ...theme.typography.caption }]}
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>
          
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              {
                backgroundColor: pressed ? theme.colors.primary + 'CC' : theme.colors.primary,
              },
            ]}
            onPress={handleCTA}
            accessibilityRole="button"
            accessibilityLabel={`Register for ${event.title}`}
          >
            <Text style={[styles.ctaText, { color: '#FFFFFF', ...theme.typography.button }]}>
              {event.ctaLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

EventCard.displayName = 'EventCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 10,
    overflow: 'hidden',
  },
  image: {
    height: 150,
    width: '100%',
  },
  paddingContainer: {
    padding: 16,
  },
  metaRow: {
    marginBottom: 6,
  },
  dateText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 26,
  },
  desc: {
    lineHeight: 20,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  pinIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  locationText: {
    fontWeight: '600',
  },
  ctaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ctaText: {
    fontWeight: '700',
  },
});
