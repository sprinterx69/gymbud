import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Font } from '../constants/theme';
import { MOCK_HOSTS } from '../constants/mockData';
import { saveUserReview, getUserProfile } from '../services/storageService';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'LeaveReview'>;

export default function LeaveReviewScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { hostId } = route.params;
  const host = MOCK_HOSTS.find((h) => h.id === hostId);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  if (!host) return null;

  const canSubmit = rating > 0 && text.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Incomplete', 'Please select a rating and write at least 10 characters.');
      return;
    }

    const profile = await getUserProfile();
    const authorName = profile?.name || 'Anonymous';
    const initials = authorName.split(' ').map((w) => w[0]).join('');

    const review = {
      id: `ur_${Date.now()}`,
      author: `${initials.toUpperCase()}.`,
      rating,
      text: text.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    await saveUserReview(hostId, review);
    Alert.alert(
      'Review Submitted!',
      `Thanks for reviewing your session with ${host.name}.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Review</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        {/* Host info */}
        <View style={styles.hostRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{host.initials}</Text>
          </View>
          <View>
            <Text style={styles.hostName}>{host.name}</Text>
            <Text style={styles.hostType}>{host.workoutType}</Text>
          </View>
        </View>

        {/* Star rating */}
        <Text style={styles.label}>Your Rating</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
              <Text style={[styles.star, i <= rating && styles.starFilled]}>
                {'\u2605'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingHint}>
          {rating === 0 && 'Tap a star to rate'}
          {rating === 1 && 'Poor'}
          {rating === 2 && 'Below Average'}
          {rating === 3 && 'Good'}
          {rating === 4 && 'Great'}
          {rating === 5 && 'Amazing!'}
        </Text>

        {/* Review text */}
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.textArea}
          value={text}
          onChangeText={setText}
          placeholder="How was your workout? What did you like about training with this host?"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>
          {text.trim().length < 10
            ? `${10 - text.trim().length} more characters needed`
            : `${text.trim().length} characters`}
        </Text>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backText: {
    fontSize: Font.md,
    fontWeight: '600',
    color: Colors.accent,
  },
  headerTitle: {
    fontSize: Font.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Font.lg,
    fontWeight: '700',
    color: Colors.accent,
  },
  hostName: {
    fontSize: Font.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  hostType: {
    fontSize: Font.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  label: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  starRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.xs,
  },
  star: {
    fontSize: 36,
    color: Colors.starEmpty,
  },
  starFilled: {
    color: Colors.star,
  },
  ratingHint: {
    fontSize: Font.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  textArea: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: Font.md,
    color: Colors.text,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    fontSize: Font.lg,
    fontWeight: '800',
    color: Colors.white,
  },
});
