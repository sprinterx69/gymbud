import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  Booking,
  Review,
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../types';

const KEYS = {
  USER_PROFILE: '@gymbud_user',
  BOOKINGS: '@gymbud_bookings',
  ONBOARDED: '@gymbud_onboarded',
  FAVORITES: '@gymbud_favorites',
  USER_REVIEWS: '@gymbud_user_reviews',
  NOTIFICATIONS: '@gymbud_notifications',
} as const;

// User profile
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
};

// Onboarding
export const hasOnboarded = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return val === 'true';
  } catch {
    return false;
  }
};

export const setOnboarded = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
  } catch (e) {
    console.error('Failed to set onboarded:', e);
  }
};

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveBooking = async (booking: Booking): Promise<Booking[]> => {
  const existing = await getBookings();
  existing.push(booking);
  try {
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save booking:', e);
  }
  return existing;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status'],
): Promise<Booking[]> => {
  const existing = await getBookings();
  const updated = existing.map((b) =>
    b.id === bookingId ? { ...b, status } : b,
  );
  try {
    await AsyncStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update booking status:', e);
  }
  return updated;
};

// Favorites
export const getFavorites = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = async (hostId: string): Promise<string[]> => {
  const favorites = await getFavorites();
  const index = favorites.indexOf(hostId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(hostId);
  }
  try {
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to toggle favorite:', e);
  }
  return favorites;
};

// User reviews
export const getUserReviews = async (): Promise<Record<string, Review>> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_REVIEWS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveUserReview = async (hostId: string, review: Review): Promise<void> => {
  const reviews = await getUserReviews();
  reviews[hostId] = review;
  try {
    await AsyncStorage.setItem(KEYS.USER_REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save review:', e);
  }
};

// Notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
};

export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save notification settings:', e);
  }
};

// Reset
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};
