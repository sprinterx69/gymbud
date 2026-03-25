import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Font } from '../constants/theme';
import { getBookings, updateBookingStatus } from '../services/storageService';
import { MOCK_BOOKINGS, MOCK_HOSTS } from '../constants/mockData';
import { Booking, RootStackParamList } from '../types';
import SessionCard from '../components/SessionCard';

export default function SessionsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, []),
  );

  const loadBookings = async () => {
    const saved = await getBookings();
    // Merge saved bookings with demo data, avoiding duplicates by id
    const savedIds = new Set(saved.map((b) => b.id));
    const demo = MOCK_BOOKINGS.filter((b) => !savedIds.has(b.id));
    setBookings([...saved, ...demo]);
  };

  const handleSessionPress = (booking: Booking) => {
    const host = MOCK_HOSTS.find((h) => h.id === booking.hostId);
    if (!host) return;

    if (booking.status === 'confirmed') {
      Alert.alert(
        booking.focus,
        `With ${host.name}\n${booking.day} @ ${booking.time}\n${host.gym.name}`,
        [
          {
            text: 'Cancel Session',
            style: 'destructive',
            onPress: async () => {
              await updateBookingStatus(booking.id, 'cancelled');
              loadBookings();
            },
          },
          {
            text: 'View Host',
            onPress: () => navigation.navigate('HostProfile', { hostId: host.id }),
          },
          { text: 'Close' },
        ],
      );
    } else {
      Alert.alert(
        booking.focus,
        `Completed with ${host.name}\n${booking.day} @ ${booking.time}`,
        [
          {
            text: 'Book Again',
            onPress: () => navigation.navigate('HostProfile', { hostId: host.id }),
          },
          { text: 'Close' },
        ],
      );
    }
  };

  const upcoming = bookings.filter((b) => b.status === 'confirmed');
  const past = bookings.filter((b) => b.status === 'completed');
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Sessions</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcoming.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'past' && styles.tabActive]}
          onPress={() => setTab('past')}
        >
          <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>
            Past ({past.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shown}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard booking={item} onPress={() => handleSessionPress(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'upcoming'
                ? 'Browse hosts and book your first workout'
                : 'Your completed sessions will appear here'}
            </Text>
            {tab === 'upcoming' && (
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate('Browse' as never)}
              >
                <Text style={styles.browseBtnText}>Find a Gym Partner</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Font.xxl,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
  },
  tabActive: {
    backgroundColor: Colors.accentMuted,
  },
  tabText: {
    fontSize: Font.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  empty: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Font.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Font.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.lg,
  },
  browseBtnText: {
    fontSize: Font.md,
    fontWeight: '700',
    color: Colors.white,
  },
});
