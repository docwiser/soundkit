import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Volume2, 
  Image as ImageIcon, 
  RotateCcw, 
  FastForward, 
  Gauge, 
  Download,
  Moon,
  Info,
  Trash2,
  ChevronLeft,
  Shield,
  FileText,
  Code
} from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import * as FileSystem from 'expo-file-system';
import ClearDownloadsModal from '../components/ClearDownloadsModal';
const QUALITY_OPTIONS = [
  { label: 'Low (96kbps)', value: 'low' },
  { label: 'Medium (160kbps)', value: 'medium' },
  { label: 'High (320kbps)', value: 'high' },
];
const THUMBNAIL_OPTIONS = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];
const DURATION_OPTIONS = [
  { label: '5 seconds', value: 5 },
  { label: '10 seconds', value: 10 },
  { label: '15 seconds', value: 15 },
  { label: '30 seconds', value: 30 },
  {label: '1minutes', value: 60},
];
const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x (Normal)', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2.0 },
];
export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    audioQuality: 'medium',
    thumbnailSize: 'medium',
    rewindDuration: 10,
    fastForwardDuration: 10,
    playbackSpeed: 1.0,
    autoplay: true,
    downloadQuality: 'medium',
    darkMode: true,
  });
  const [storageUsage, setStorageUsage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [showClearDownloads, setShowClearDownloads] = useState(false);
  useEffect(() => {
    loadSettings();
    calculateStorageUsage();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await storageService.getSettings();
    setSettings(savedSettings);
  };

  const saveSettings = async (newSettings) => {
    setSettings(newSettings);
    await storageService.saveSettings(newSettings);
  };

  const calculateStorageUsage = async () => {
    try {
      const downloadedSongs = await storageService.getDownloadedSongs();
      let totalSize = 0;
      
      for (const song of downloadedSongs) {
        if (song.localUri) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(song.localUri);
            if (fileInfo.exists) {
              totalSize += fileInfo.size || 0;
            }
          } catch (error) {
            console.log('Error getting file info:', error);
          }
        }
      }
      
      setStorageUsage(totalSize);
      // Estimate total available storage (this is a rough estimate)
      setTotalStorage(totalSize > 0 ? totalSize * 10 : 1024 * 1024 * 1024); // 1GB default
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  const clearDownloads = async () => {
    try {
      const downloadedSongs = await storageService.getDownloadedSongs();
      
      // Delete all files
      for (const song of downloadedSongs) {
        if (song.localUri) {
          await FileSystem.deleteAsync(song.localUri, { idempotent: true });
        }
      }
      
      // Clear storage
      await storageService.saveDownloadedSongs([]);
      setStorageUsage(0);
      setShowClearDownloads(false);
    } catch (error) {
      console.error('Error clearing downloads:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const renderSettingSection = (title, children) => (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderOptionSetting = (title, icon, options, currentValue, onSelect) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <View style={styles.settingTitleContainer}>
          {icon}
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionButton,
              currentValue === option.value && styles.optionButtonActive,
            ]}
            onPress={() => onSelect(option.value)}
            accessibilityLabel={option.label}
            aria-selected={option.value == currentValue}
          >
            <Text
              style={[
                styles.optionText,
                currentValue === option.value && styles.optionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
  const renderToggleSetting = (title, icon, value, onToggle, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <View style={styles.settingTitleContainer}>
          {icon}
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description && (
              <Text style={styles.settingDescription}>{description}</Text>
            )}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#334155', true: '#3b82f6' }}
          thumbColor={value ? '#ffffff' : '#64748b'}
          accessibilityLabel={title}
        />
      </View>
    </View>
  );
  const renderNavigationItem = (title, icon, onPress) => (
    <Pressable 
      style={styles.settingItem} 
      onPress={onPress}
      accessibilityLabel={title}
    >
      <View style={styles.settingHeader}>
        <View style={styles.settingTitleContainer}>
          {icon}
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
      </View>
    </Pressable>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSettingSection(
          'Audio Quality',
          renderOptionSetting(
            'Default Audio Quality',
            <Volume2 size={20} color="#3b82f6" />,
            QUALITY_OPTIONS,
            settings.audioQuality,
            (value) => saveSettings({ ...settings, audioQuality: value })
          )
        )}

        {renderSettingSection(
          'Display',
          <>
            {renderOptionSetting(
              'Thumbnail Size',
              <ImageIcon size={20} color="#3b82f6" />,
              THUMBNAIL_OPTIONS,
              settings.thumbnailSize,
              (value) => saveSettings({ ...settings, thumbnailSize: value })
            )}
            {renderToggleSetting(
              'Dark Mode',
              <Moon size={20} color="#3b82f6" />,
              settings.darkMode,
              (value) => saveSettings({ ...settings, darkMode: value }),
              'Use dark theme throughout the app'
            )}
          </>
        )}

        {renderSettingSection(
          'Playback',
          <>
            {renderOptionSetting(
              'Rewind Duration',
              <RotateCcw size={20} color="#3b82f6" />,
              DURATION_OPTIONS,
              settings.rewindDuration,
              (value) => saveSettings({ ...settings, rewindDuration: value })
            )}
            {renderOptionSetting(
              'Fast Forward Duration',
              <FastForward size={20} color="#3b82f6" />,
              DURATION_OPTIONS,
              settings.fastForwardDuration,
              (value) => saveSettings({ ...settings, fastForwardDuration: value })
            )}
            {renderOptionSetting(
              'Default Playback Speed',
              <Gauge size={20} color="#3b82f6" />,
              SPEED_OPTIONS,
              settings.playbackSpeed,
              (value) => saveSettings({ ...settings, playbackSpeed: value })
            )}
            {renderToggleSetting(
              'Autoplay',
              <Volume2 size={20} color="#3b82f6" />,
              settings.autoplay,
              (value) => saveSettings({ ...settings, autoplay: value }),
              'Automatically play next song when current song ends'
            )}
          </>
        )}

        {renderSettingSection(
          'Downloads',
          <>
            {renderOptionSetting(
              'Download Quality',
              <Download size={20} color="#3b82f6" />,
              QUALITY_OPTIONS,
              settings.downloadQuality,
              (value) => saveSettings({ ...settings, downloadQuality: value })
            )}
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingTitleContainer}>
                  <Info size={20} color="#3b82f6" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Storage Usage</Text>
                    <Text style={styles.settingDescription}>
                      {formatBytes(storageUsage)} of {formatBytes(totalStorage)} used for downloads
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={styles.clearButton}
                  onPress={() => setShowClearDownloads(true)}
                  accessibilityLabel="Clear all downloads"
                >
                  <Trash2 size={16} color="#ef4444" />
                  <Text style={styles.clearButtonText}>Clear</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {renderSettingSection(
          'About',
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingTitleContainer}>
                  <Info size={20} color="#3b82f6" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>SoundKit</Text>
                    <Text style={styles.settingDescription}>
                      Version 1.0.0 • Music streaming app
                    </Text>
                    <Text style={styles.settingDescription}>
                      Powered by Saavn.dev API
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {renderNavigationItem(
              'About Us',
              <Info size={20} color="#64748b" />,
              () => router.push('/about')
            )}
            {renderNavigationItem(
              'Privacy Policy',
              <Shield size={20} color="#64748b" />,
              () => router.push('/privacy')
            )}
            {renderNavigationItem(
              'Terms & Conditions',
              <FileText size={20} color="#64748b" />,
              () => router.push('/terms')
            )}
            {renderNavigationItem(
              'Open Source Licenses',
              <Code size={20} color="#64748b" />,
              () => router.push('/licenses')
            )}
          </>
        )}
      </ScrollView>

      <ClearDownloadsModal
        visible={showClearDownloads}
        onClose={() => setShowClearDownloads(false)}
        onConfirm={clearDownloads}
      />
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});