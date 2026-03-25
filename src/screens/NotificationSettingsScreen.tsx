import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Font } from '../constants/theme';
import { getNotificationSettings, saveNotificationSettings } from '../services/storageService';
import { RootStackParamList, NotificationSettings } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

interface SettingRowProps {
  title: string;
  description: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}

function SettingRow({ title, description, value, onToggle }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.bgElevated, true: Colors.accentMuted }}
        thumbColor={value ? Colors.accent : Colors.textMuted}
      />
    </View>
  );
}

export default function NotificationSettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<NotificationSettings>({
    sessionReminders: true,
    bookingConfirmations: true,
    promotions: false,
    newHosts: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await getNotificationSettings();
    setSettings(saved);
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveNotificationSettings(updated);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Workout</Text>
        <View style={styles.card}>
          <SettingRow
            title="Session Reminders"
            description="Get reminded 1 hour before your workout"
            value={settings.sessionReminders}
            onToggle={(v) => updateSetting('sessionReminders', v)}
          />
          <SettingRow
            title="Booking Confirmations"
            description="Get notified when a session is booked"
            value={settings.bookingConfirmations}
            onToggle={(v) => updateSetting('bookingConfirmations', v)}
          />
        </View>

        <Text style={styles.sectionLabel}>Discovery</Text>
        <View style={styles.card}>
          <SettingRow
            title="New Hosts Nearby"
            description="When new hosts join at your gym"
            value={settings.newHosts}
            onToggle={(v) => updateSetting('newHosts', v)}
          />
          <SettingRow
            title="Promotions"
            description="Deals, discounts, and special offers"
            value={settings.promotions}
            onToggle={(v) => updateSetting('promotions', v)}
          />
        </View>

        <Text style={styles.footnote}>
          Notification preferences are saved locally. Push notifications will be available in a future update.
        </Text>
      </View>
    </View>
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
    paddingVertical: Spacing.md,
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
  sectionLabel: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontSize: Font.md,
    fontWeight: '600',
    color: Colors.text,
  },
  settingDesc: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footnote: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
});
