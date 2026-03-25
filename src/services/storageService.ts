import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Booking } from '../types';

const KEYS = {
  USER_PROFILE: '@gymbud_user',
  BOOKINGS: '@gymbud_bookings',
  ONBOARDED: '@gymbud_onboarded',
} as const;

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

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
};
