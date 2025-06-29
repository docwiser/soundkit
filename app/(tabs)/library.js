import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Download, Clock, Music, Info, Shield, FileText, Code } from 'lucide-react-native';
import { router } from 'expo-router';
import { storageService } from '../../services/storage';
import { audioPlayer } from '../../services/audioPlayer';
import SongItem from '../../components/SongItem';
import MiniPlayer from '../../components/MiniPlayer';
import CreatePlaylistModal from '../../components/CreatePlaylistModal';
import NetworkStatus from '../../components/NetworkStatus';

const LIBRARY_SECTIONS = {
  PLAYLISTS: 'playlists',
  DOWNLOADED: 'downloaded',
  HISTORY: 'history',
};

export default function LibraryScreen() {
  const [activeSection, setActiveSection] = useState(LIBRARY_SECTIONS.PLAYLISTS);
  const [playlists, setPlaylists] = useState([]);
  const [downloaded, setDownloaded] = useState([]);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      const [playlistsData, downloadedData, historyData] = await Promise.all([
        storageService.getPlaylists(),
        storageService.getDownloadedSongs(),
        storageService.getPlaybackHistory(),
      ]);

      setPlaylists(playlistsData);
      setDownloaded(downloadedData);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading library data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLibraryData();
    setRefreshing(false);
  };

  const createPlaylist = async (name, description) => {
    const playlist = await storageService.createPlaylist(name, description);
    if (playlist) {
      setPlaylists(prev => [...prev, playlist]);
      setShowCreatePlaylist(false);
    } else {
      Alert.alert('Error', 'Failed to create playlist');
    }
  };

  const deletePlaylist = (playlistId) => {
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete this playlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await storageService.deletePlaylist(playlistId);
            if (success) {
              setPlaylists(prev => prev.filter(p => p.id !== playlistId));
            }
          },
        },
      ]
    );
  };

  const playPlaylist = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      audioPlayer.setQueue(playlist.songs, 0);
      audioPlayer.loadSong(playlist.songs[0]);
    }
  };

  const playSongs = (songs, startIndex = 0) => {
    if (songs && songs.length > 0) {
      audioPlayer.setQueue(songs, startIndex);
      audioPlayer.loadSong(songs[startIndex]);
    }
  };

  const renderSectionButton = (section, label, icon) => (
    <Pressable
      style={[
        styles.sectionButton,
        activeSection === section && styles.sectionButtonActive,
      ]}
      onPress={() => setActiveSection(section)}
    >
      {icon}
      <Text
        style={[
          styles.sectionButtonText,
          activeSection === section && styles.sectionButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderPlaylistItem = ({ item }) => (
    <Pressable
      style={styles.playlistItem}
      onPress={() => playPlaylist(item)}
      onLongPress={() => deletePlaylist(item.id)}
    >
      <View style={styles.playlistIcon}>
        <Music size={24} color="#3b82f6" />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.playlistDetails} numberOfLines={1}>
          {item.songs.length} song{item.songs.length !== 1 ? 's' : ''}
          {item.description && ` • ${item.description}`}
        </Text>
      </View>
    </Pressable>
  );

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => {
        const songs = activeSection === LIBRARY_SECTIONS.DOWNLOADED ? downloaded : history;
        playSongs(songs, index);
      }}
    />
  );

  const renderNavigationItem = ({ item }) => (
    <Pressable
      style={styles.navigationItem}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.navigationIcon}>
        {item.icon}
      </View>
      <Text style={styles.navigationText}>{item.title}</Text>
    </Pressable>
  );

  const navigationItems = [
    { id: 'about', title: 'About Us', icon: <Info size={20} color="#64748b" />, route: '/about' },
    { id: 'privacy', title: 'Privacy Policy', icon: <Shield size={20} color="#64748b" />, route: '/privacy' },
    { id: 'terms', title: 'Terms & Conditions', icon: <FileText size={20} color="#64748b" />, route: '/terms' },
    { id: 'licenses', title: 'Open Source Licenses', icon: <Code size={20} color="#64748b" />, route: '/licenses' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case LIBRARY_SECTIONS.PLAYLISTS:
        return (
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <Pressable
                style={styles.createPlaylistButton}
                onPress={() => setShowCreatePlaylist(true)}
              >
                <View style={styles.createPlaylistIcon}>
                  <Plus size={24} color="#3b82f6" />
                </View>
                <View style={styles.createPlaylistInfo}>
                  <Text style={styles.createPlaylistText}>Create Playlist</Text>
                  <Text style={styles.createPlaylistSubtext}>
                    Make your own mix of songs
                  </Text>
                </View>
              </Pressable>
            )}
            ListFooterComponent={() => (
              <View style={styles.navigationSection}>
                <Text style={styles.navigationSectionTitle}>More</Text>
                <FlatList
                  data={navigationItems}
                  renderItem={renderNavigationItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Music size={48} color="#64748b" />
                <Text style={styles.emptyText}>No playlists yet</Text>
                <Text style={styles.emptySubtext}>
                  Create your first playlist to organize your music
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
            }
            showsVerticalScrollIndicator={false}
          />
        );

      case LIBRARY_SECTIONS.DOWNLOADED:
        return (
          <FlatList
            data={downloaded}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Download size={48} color="#64748b" />
                <Text style={styles.emptyText}>No downloads yet</Text>
                <Text style={styles.emptySubtext}>
                  Download songs to listen offline
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
            }
            showsVerticalScrollIndicator={false}
          />
        );

      case LIBRARY_SECTIONS.HISTORY:
        return (
          <FlatList
            data={history}
            renderItem={renderSongItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Clock size={48} color="#64748b" />
                <Text style={styles.emptyText}>No playback history</Text>
                <Text style={styles.emptySubtext}>
                  Songs you play will appear here
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
            }
            showsVerticalScrollIndicator={false}
          />
        );

      default:
        return null;
    }
  };

  return (
    <NetworkStatus>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
        </View>

        <View style={styles.sectionsContainer}>
          {renderSectionButton(
            LIBRARY_SECTIONS.PLAYLISTS,
            'Playlists',
            <Music size={20} color={activeSection === LIBRARY_SECTIONS.PLAYLISTS ? '#ffffff' : '#64748b'} />
          )}
          {renderSectionButton(
            LIBRARY_SECTIONS.DOWNLOADED,
            'Downloads',
            <Download size={20} color={activeSection === LIBRARY_SECTIONS.DOWNLOADED ? '#ffffff' : '#64748b'} />
          )}
          {renderSectionButton(
            LIBRARY_SECTIONS.HISTORY,
            'History',
            <Clock size={20} color={activeSection === LIBRARY_SECTIONS.HISTORY ? '#ffffff' : '#64748b'} />
          )}
        </View>

        <View style={styles.content}>
          {renderContent()}
        </View>

        <CreatePlaylistModal
          visible={showCreatePlaylist}
          onClose={() => setShowCreatePlaylist(false)}
          onCreate={createPlaylist}
        />

        <MiniPlayer />
      </SafeAreaView>
    </NetworkStatus>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sectionButtonText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  sectionButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  createPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  createPlaylistIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  createPlaylistInfo: {
    flex: 1,
  },
  createPlaylistText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  createPlaylistSubtext: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  playlistDetails: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  navigationSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  navigationSectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  navigationIcon: {
    marginRight: 16,
  },
  navigationText: {
    color: '#ffffff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});