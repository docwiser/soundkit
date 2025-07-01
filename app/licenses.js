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

export default function LicensesScreen() {
  const licenses = [
    {
      name: 'React Native',
      version: '0.79.1',
      license: 'MIT',
      description: 'A framework for building native apps using React',
    },
    {
      name: 'Expo',
      version: '53.0.0',
      license: 'MIT',
      description: 'An open-source platform for making universal native apps',
    },
    {
      name: 'Expo Router',
      version: '5.0.2',
      license: 'MIT',
      description: 'File-based router for React Native and web applications',
    },
    {
      name: 'Expo AV',
      version: '14.0.0',
      license: 'MIT',
      description: 'Audio and video playback library for Expo',
    },
    {
      name: 'React Native Reanimated',
      version: '3.17.4',
      license: 'MIT',
      description: 'React Native\'s Animated library reimplemented',
    },
    {
      name: 'React Native Gesture Handler',
      version: '2.24.0',
      license: 'MIT',
      description: 'Declarative API exposing platform native touch and gesture system',
    },
    {
      name: 'Lucide React Native',
      version: '0.475.0',
      license: 'ISC',
      description: 'Beautiful & consistent icon toolkit made by the community',
    },
    {
      name: 'Expo Linear Gradient',
      version: '14.1.3',
      license: 'MIT',
      description: 'Linear gradient component for React Native',
    },
    {
      name: 'React Native Community Slider',
      version: '4.5.2',
      license: 'MIT',
      description: 'React Native component used to select a single value from a range of values',
    },
    {
      name: 'React Native NetInfo',
      version: '11.3.1',
      license: 'MIT',
      description: 'React Native Network Info API for Android & iOS',
    },
  ];

  const renderLicenseItem = (item, index) => (
    <View key={index} style={styles.licenseItem}>
      <View style={styles.licenseHeader}>
        <Text accessibilityRole="header" style={styles.licenseName}>{item.name}</Text>
        <Text style={styles.licenseVersion}>v{item.version}</Text>
      </View>
      <Text style={styles.licenseDescription}>{item.description}</Text>
      <Text style={styles.licenseType}>License: {item.license}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Back" accessibilityRole="button">
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
        <Text accessibilityRole="header" style={styles.headerTitle}>Open Source Licenses</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            SoundKit is built using open source software. We are grateful to the open source 
            community for their contributions. Below are the licenses for the libraries and 
            frameworks used in this application.
          </Text>

          <View style={styles.licensesContainer}>
            {licenses.map(renderLicenseItem)}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              For more information about these licenses, please visit the respective project repositories.
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
  description: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
    marginBottom: 24,
  },
  licensesContainer: {
    gap: 16,
  },
  licenseItem: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  licenseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  licenseVersion: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  licenseDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 8,
  },
  licenseType: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});