import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Font } from '../constants/theme';
import { WORKOUT_TYPES, GYMS } from '../constants/mockData';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { RootStackParamList, Gym, UserProfile } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [role, setRole] = useState<'client' | 'host'>('client');
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getUserProfile();
    if (!profile) return;
    setOriginalProfile(profile);
    setName(profile.name);
    setAge(String(profile.age));
    setSelectedGym(profile.gym);
    setSelectedWorkout(profile.workoutType);
    setBio(profile.bio);
    setRole(profile.role);
  };

  const hasChanges = () => {
    if (!originalProfile) return false;
    return (
      name.trim() !== originalProfile.name ||
      age !== String(originalProfile.age) ||
      selectedGym?.id !== originalProfile.gym?.id ||
      selectedWorkout !== originalProfile.workoutType ||
      bio.trim() !== originalProfile.bio
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 99) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 16 and 99.');
      return;
    }
    if (!selectedGym) {
      Alert.alert('Required', 'Please select your gym.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...originalProfile!,
      name: name.trim(),
      age: parsedAge,
      gym: selectedGym,
      workoutType: selectedWorkout,
      bio: bio.trim(),
      initials: name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2),
    };

    await saveUserProfile(updatedProfile);
    Alert.alert('Saved', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleBack = () => {
    if (hasChanges()) {
      Alert.alert('Unsaved Changes', 'You have unsaved changes. Discard them?', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  const isHost = role === 'host';
  const canSave = name.trim() && age.trim() && selectedGym;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.headerAction}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <Text style={[styles.headerAction, styles.saveAction, !canSave && styles.saveDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Avatar preview */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.trim()
                ? name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 2)
                : '?'}
            </Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={Colors.textMuted}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={[styles.input, { width: 100 }]}
          value={age}
          onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
          placeholder="25"
          placeholderTextColor={Colors.textMuted}
          keyboardType="number-pad"
          maxLength={2}
        />

        {/* Gym */}
        <Text style={styles.label}>Your Gym</Text>
        <View style={styles.chipGrid}>
          {GYMS.map((gym) => (
            <TouchableOpacity
              key={gym.id}
              style={[styles.chip, selectedGym?.id === gym.id && styles.chipSelected]}
              onPress={() => setSelectedGym(gym)}
            >
              <Text style={[styles.chipText, selectedGym?.id === gym.id && styles.chipTextSelected]}>
                {gym.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Workout type */}
        <Text style={styles.label}>
          {isHost ? 'Your Workout Split' : 'Preferred Style'}
        </Text>
        <View style={styles.chipGrid}>
          {WORKOUT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, selectedWorkout === type && styles.chipSelected]}
              onPress={() => setSelectedWorkout(selectedWorkout === type ? null : type)}
            >
              <Text style={[styles.chipText, selectedWorkout === type && styles.chipTextSelected]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          placeholder={isHost
            ? 'Tell people about your workout style...'
            : 'Tell hosts about yourself and your goals...'}
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Role indicator */}
        <View style={styles.roleSection}>
          <Text style={styles.roleLabel}>Account Type</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>{isHost ? 'Host' : 'Client'}</Text>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: Colors.bg,
  },
  headerTitle: {
    fontSize: Font.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  headerAction: {
    fontSize: Font.md,
    fontWeight: '600',
    color: Colors.accent,
  },
  saveAction: {
    fontWeight: '800',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Font.xxl,
    fontWeight: '700',
    color: Colors.accent,
  },
  label: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: Font.md,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: Font.sm,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.accent,
    fontWeight: '700',
  },
  roleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleLabel: {
    fontSize: Font.md,
    color: Colors.text,
  },
  rolePill: {
    backgroundColor: Colors.accentMuted,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  roleText: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.accent,
  },
});
