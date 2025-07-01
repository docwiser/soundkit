import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  Download, 
  Search, 
  Music, 
  Settings,
  Volume2,
  Repeat,
  Shuffle,
  Mic
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function HelpScreen() {
  const helpSections = [
    {
      title: 'Getting Started',
      items: [
        {
          icon: <Music size={20} color="#3b82f6" />,
          title: 'Browse Music',
          description: 'Explore trending songs, browse by categories like Hindi, English, Bollywood, and more from the home screen.'
        },
        {
          icon: <Search size={20} color="#3b82f6" />,
          title: 'Search Songs',
          description: 'Use the search tab to find specific songs, artists, albums, or playlists. You can also use voice search by tapping the microphone icon.'
        },
        {
          icon: <Play size={20} color="#3b82f6" />,
          title: 'Play Music',
          description: 'Tap any song to start playing. The mini player will appear at the bottom, and you can tap it to open the full player.'
        }
      ]
    },
    {
      title: 'Player Controls',
      items: [
        {
          icon: <Play size={20} color="#3b82f6" />,
          title: 'Play/Pause',
          description: 'Tap the play/pause button to control playback. You can also use the mini player controls.'
        },
        {
          icon: <SkipBack size={20} color="#3b82f6" />,
          title: 'Previous/Next',
          description: 'Skip to the previous or next song in your queue using the arrow buttons.'
        },
        {
          icon: <Volume2 size={20} color="#3b82f6" />,
          title: 'Rewind/Fast Forward',
          description: 'Use the rewind and fast forward buttons to jump backward or forward by 10 seconds (customizable in settings).'
        },
        {
          icon: <Repeat size={20} color="#3b82f6" />,
          title: 'Repeat & Shuffle',
          description: 'Toggle repeat mode (none, one song, all songs) and shuffle mode using the controls in the player.'
        }
      ]
    },
    {
      title: 'Voice Search',
      items: [
        {
          icon: <Mic size={20} color="#3b82f6" />,
          title: 'Voice Commands',
          description: 'Tap the microphone icon in the search screen to search using your voice. Say the name of a song, artist, or album.'
        },
        {
          icon: <Search size={20} color="#3b82f6" />,
          title: 'Voice Search Tips',
          description: 'Speak clearly and mention specific details like "play [song name] by [artist]" for better results.'
        }
      ]
    },
    {
      title: 'Library Management',
      items: [
        {
          icon: <Heart size={20} color="#3b82f6" />,
          title: 'Favorites',
          description: 'Tap the heart icon on any song to add it to your favorites. Access all your favorite songs from the favorites tab.'
        },
        {
          icon: <Download size={20} color="#3b82f6" />,
          title: 'Downloads',
          description: 'Download songs for offline listening by tapping the download icon. Manage your downloads in the library tab.'
        },
        {
          icon: <Music size={20} color="#3b82f6" />,
          title: 'Playlists',
          description: 'Create custom playlists to organize your music. Add songs to playlists using the action menu (three dots).'
        }
      ]
    },
    {
      title: 'Settings & Customization',
      items: [
        {
          icon: <Volume2 size={20} color="#3b82f6" />,
          title: 'Audio Quality',
          description: 'Adjust audio quality for streaming and downloads in the settings. Choose from low, medium, or high quality.'
        },
        {
          icon: <Settings size={20} color="#3b82f6" />,
          title: 'Playback Settings',
          description: 'Customize rewind/fast forward duration, default playback speed, and autoplay behavior in settings.'
        },
        {
          icon: <Download size={20} color="#3b82f6" />,
          title: 'Storage Management',
          description: 'Monitor your download storage usage and clear downloads to free up space when needed.'
        }
      ]
    },
    {
      title: 'Tips & Tricks',
      items: [
        {
          icon: <Music size={20} color="#3b82f6" />,
          title: 'Queue Management',
          description: 'View and manage your current playing queue in the full player. Songs will automatically continue playing from your queue.'
        },
        {
          icon: <Search size={20} color="#3b82f6" />,
          title: 'Better Search Results',
          description: 'Use specific keywords, artist names, or song titles for more accurate search results. Try different spellings if needed.'
        },
        {
          icon: <Heart size={20} color="#3b82f6" />,
          title: 'Discover New Music',
          description: 'Check out the "Up Next" recommendations in the player to discover similar songs and new artists.'
        }
      ]
    }
  ];

  const renderHelpSection = (section, index) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map((item, itemIndex) => (
        <View key={itemIndex} style={styles.helpItem}>
          <View style={styles.helpIcon}>
            {item.icon}
          </View>
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>{item.title}</Text>
            <Text style={styles.helpDescription}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
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
        <Text accessibilityRole="header" style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Welcome to SoundKit! Here's everything you need to know to get the most out of your music streaming experience.
          </Text>

          {helpSections.map(renderHelpSection)}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Need More Help?</Text>
            <Text style={styles.footerText}>
              If you're still having trouble or have questions not covered here, you can:
            </Text>
            <Text style={styles.footerBullet}>• Check our Privacy Policy and Terms & Conditions</Text>
            <Text style={styles.footerBullet}>• Review the Open Source Licenses for technical details</Text>
            <Text style={styles.footerBullet}>• Contact us through the About section</Text>
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
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  helpIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerBullet: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginLeft: 8,
  },
});