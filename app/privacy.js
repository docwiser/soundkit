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

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Back">
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: December 2024</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.description}>
              SoundKit collects minimal information to provide you with the best music streaming experience:
            </Text>
            <Text style={styles.bulletPoint}>• Music preferences and listening history</Text>
            <Text style={styles.bulletPoint}>• Playlists and favorite songs</Text>
            <Text style={styles.bulletPoint}>• App usage analytics to improve performance</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.description}>
              Your information is used to:
            </Text>
            <Text style={styles.bulletPoint}>• Provide personalized music recommendations</Text>
            <Text style={styles.bulletPoint}>• Save your playlists and preferences</Text>
            <Text style={styles.bulletPoint}>• Improve app functionality and user experience</Text>
            <Text style={styles.bulletPoint}>• Ensure app security and prevent abuse</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Storage</Text>
            <Text style={styles.description}>
              All your personal data is stored locally on your device. We do not store your personal 
              information on external servers. Your playlists, favorites, and listening history remain 
              private and under your control.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.description}>
              SoundKit uses the Saavn.dev API to provide music content. Please refer to their privacy 
              policy for information about how they handle data. We do not share your personal 
              information with third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.description}>
              We implement appropriate security measures to protect your information against 
              unauthorized access, alteration, disclosure, or destruction. Since data is stored 
              locally, you have full control over your information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.description}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access your personal data</Text>
            <Text style={styles.bulletPoint}>• Delete your data at any time</Text>
            <Text style={styles.bulletPoint}>• Control what information is collected</Text>
            <Text style={styles.bulletPoint}>• Opt out of analytics collection</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.description}>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new privacy policy in the app. You are advised to review 
              this privacy policy periodically for any changes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.description}>
              If you have any questions about this privacy policy, please contact us at:
            </Text>
            <Text style={styles.contactText}>privacy@soundkit.app</Text>
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