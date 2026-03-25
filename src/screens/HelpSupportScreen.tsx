import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Font } from '../constants/theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'What is GymBud?',
    answer: 'GymBud connects you with real gym-goers who host workout sessions. Instead of hiring a personal trainer, you join someone\'s actual workout and follow along — like working out with a knowledgeable friend.',
  },
  {
    question: 'How does booking work?',
    answer: 'Browse available hosts, view their schedule, and tap a workout day to book. You\'ll get a confirmation with the time, location, and focus area. Show up and follow their routine!',
  },
  {
    question: 'What\'s the difference between a Host and a Client?',
    answer: 'Hosts are experienced gym-goers who share their workout sessions. Clients join those sessions. Hosts set their schedule and pricing, while clients browse and book.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Each host sets their own pricing. You\'ll see per-session and weekly rates on their profile. Weekly bundles usually offer savings compared to booking individual sessions.',
  },
  {
    question: 'Can I cancel a session?',
    answer: 'Yes! Go to the Sessions tab, tap the session you want to cancel, and select "Cancel Session". We recommend canceling at least a few hours before the workout.',
  },
  {
    question: 'How do I become a Host?',
    answer: 'When setting up your profile, choose "Host Workouts". You\'ll be able to set your schedule, pricing, and workout style. Reset the app from Settings if you want to switch roles.',
  },
  {
    question: 'Are the hosts verified?',
    answer: 'Hosts with a "Verified" badge have confirmed their identity and gym membership. We recommend checking reviews before booking with any host.',
  },
  {
    question: 'What if I have issues with a host?',
    answer: 'You can leave a review after your session to share your experience. If you have a serious concern, contact our support team through the app.',
  },
];

function FAQCard({ item }: { item: FAQItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqChevron}>{expanded ? '\u2212' : '+'}</Text>
      </View>
      {expanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
    </TouchableOpacity>
  );
}

export default function HelpSupportScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>

        {FAQ_DATA.map((item, index) => (
          <FAQCard key={index} item={item} />
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactDesc}>
            Our support team is here for you. Reach out and we'll get back to you as soon as possible.
          </Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@gymbud.app</Text>
          </View>
          <View style={styles.contactCard}>
            <Text style={styles.contactLabel}>Response Time</Text>
            <Text style={styles.contactValue}>Within 24 hours</Text>
          </View>
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>GymBud v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with {'\uD83D\uDCAA'} in Boise, ID</Text>
        </View>
      </ScrollView>
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
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  sectionLabel: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  faqCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: Font.md,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  faqChevron: {
    fontSize: Font.xl,
    color: Colors.accent,
    fontWeight: '700',
  },
  faqAnswer: {
    fontSize: Font.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactSection: {
    marginTop: Spacing.xl,
  },
  contactTitle: {
    fontSize: Font.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  contactDesc: {
    fontSize: Font.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  contactCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: Font.sm,
    color: Colors.textMuted,
  },
  contactValue: {
    fontSize: Font.sm,
    fontWeight: '700',
    color: Colors.accent,
  },
  versionSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  versionText: {
    fontSize: Font.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: Font.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
