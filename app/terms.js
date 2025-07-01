import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Back" accessibilityRole="button">
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: December 2024</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            <Text style={styles.description}>
              By downloading, installing, or using SoundKit, you agree to be bound by these 
              Terms and Conditions. If you do not agree to these terms, please do not use our app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description of Service</Text>
            <Text style={styles.description}>
              SoundKit is a music streaming application that provides access to a vast library 
              of songs, albums, and playlists. The service is provided "as is" and we reserve 
              the right to modify or discontinue the service at any time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Responsibilities</Text>
            <Text style={styles.description}>
              You agree to:
            </Text>
            <Text style={styles.bulletPoint}>• Use the app only for personal, non-commercial purposes</Text>
            <Text style={styles.bulletPoint}>• Not attempt to reverse engineer or modify the app</Text>
            <Text style={styles.bulletPoint}>• Not use the app for any illegal or unauthorized purpose</Text>
            <Text style={styles.bulletPoint}>• Respect intellectual property rights of content creators</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content and Copyright</Text>
            <Text style={styles.description}>
              All music content is provided through third-party APIs and is subject to their 
              respective terms and conditions. We do not own the rights to the music content 
              and are not responsible for any copyright infringement claims.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            <Text style={styles.description}>
              Your privacy is important to us. Please review our Privacy Policy to understand 
              how we collect, use, and protect your information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disclaimers</Text>
            <Text style={styles.description}>
              SoundKit is provided "as is" without any warranties, express or implied. We do not 
              guarantee that the service will be uninterrupted, secure, or error-free. We are not 
              responsible for any damages arising from your use of the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.description}>
              In no event shall SoundKit be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.description}>
              We may terminate or suspend your access to the service immediately, without prior 
              notice or liability, for any reason whatsoever, including without limitation if you 
              breach the Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.description}>
              We reserve the right to modify or replace these Terms at any time. If a revision 
              is material, we will try to provide at least 30 days notice prior to any new terms 
              taking effect.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.description}>
              If you have any questions about these Terms and Conditions, please contact us at:
            </Text>
            <Text style={styles.contactText}>legal@soundkit.app</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    marginLeft: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#3b82f6',
    marginTop: 8,
  },
});