import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Music, Heart, Users, Mail } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Back">
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Music size={64} color="#3b82f6" />
            <Text style={styles.appName}>SoundKit</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.description}>
              SoundKit is designed to provide you with the best music streaming experience. 
              We believe music should be accessible, high-quality, and enjoyable for everyone. 
              Our app brings together millions of songs from various genres and languages, 
              all in one beautiful, easy-to-use interface.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Music size={20} color="#3b82f6" />
                <Text style={styles.featureText}>High-quality music streaming</Text>
              </View>
              <View style={styles.featureItem}>
                <Heart size={20} color="#3b82f6" />
                <Text style={styles.featureText}>Create and manage playlists</Text>
              </View>
              <View style={styles.featureItem}>
                <Users size={20} color="#3b82f6" />
                <Text style={styles.featureText}>Discover new artists and songs</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technology</Text>
            <Text style={styles.description}>
              SoundKit is built with React Native and Expo, ensuring a smooth experience 
              across all platforms. We use the Saavn.dev API to provide access to a vast 
              library of music content.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Pressable style={styles.contactItem}>
              <Mail size={20} color="#3b82f6" />
              <Text style={styles.contactText}>support@soundkit.app</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with ❤️ for music lovers everywhere
            </Text>
            <Text style={styles.copyright}>
              © 2024 SoundKit. All rights reserved.
            </Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  version: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});