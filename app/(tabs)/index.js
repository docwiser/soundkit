import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, FolderOpen, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { saavnAPI } from '../../services/api';
import { audioPlayer } from '../../services/audioPlayer';
import MiniPlayer from '../../components/MiniPlayer';
import SongItem from '../../components/SongItem';
import CategorySelector from '../../components/CategorySelector';
import NetworkStatus from '../../components/NetworkStatus';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadCategorySongs(true);
  }, [selectedCategory]);

  const loadCategorySongs = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setSongs([]);
        setPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const currentPage = reset ? 0 : page;
      const response = await saavnAPI.searchSongs(
        getCategoryQuery(selectedCategory),
        currentPage,
        20
      );

      if (response.success) {
        const newSongs = response.data.results || [];
        
        if (reset) {
          setSongs(newSongs);
        } else {
          setSongs(prev => [...prev, ...newSongs]);
        }
        
        setHasMore(newSongs.length === 20);
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error('Error loading category songs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const getCategoryQuery = (categoryId) => {
    const categories = {
      trending: 'trending songs 2024',
      hindi: 'hindi songs',
      romantic: 'romantic songs',
      bollywood: 'bollywood hits',
      punjabi: 'punjabi songs',
      english: 'english songs',
      tamil: 'tamil songs',
      telugu: 'telugu songs',
    };
    return categories[categoryId] || 'trending songs';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategorySongs(true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore && songs.length > 0) {
      loadCategorySongs(false);
    }
  };

  const playSongs = (startIndex = 0) => {
    audioPlayer.setQueue(songs, startIndex);
    audioPlayer.loadSong(songs[startIndex]);
    router.push('/player');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
  };

  const navigateToManagePlaylistsDownloads = () => {
    router.push('/(tabs)/library');
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToSearch = () => {
    router.push('/(tabs)/search');
  };

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => playSongs(index)}
      showIndex={index + 1}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Top Menu */}
      <View style={styles.topMenu}>
        <Pressable
          style={styles.topMenuButton}
          onPress={navigateToManagePlaylistsDownloads}
          accessibilityLabel="Manage playlists and downloads"
        >
          <FolderOpen size={20} color="#ffffff" />
          <Text style={styles.topMenuText}>Manage</Text>
        </Pressable>

        <Pressable
          style={styles.settingsButton}
          onPress={navigateToSettings}
          accessibilityLabel="Settings"
        >
          <Settings size={20} color="#ffffff" />
        </Pressable>

        <Pressable
          style={styles.topMenuButton}
          onPress={navigateToSearch}
          accessibilityLabel="Search"
        >
          <Search size={20} color="#ffffff" />
          <Text style={styles.topMenuText}>Search</Text>
        </Pressable>
      </View>

      {/* Category Selector */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {getCategoryDisplayName(selectedCategory)}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {songs.length} song{songs.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading more songs...</Text>
      </View>
    );
  };

  const getCategoryDisplayName = (categoryId) => {
    const names = {
      trending: 'Trending Now',
      hindi: 'Hindi Songs',
      romantic: 'Romantic Songs',
      bollywood: 'Bollywood Hits',
      punjabi: 'Punjabi Songs',
      english: 'English Songs',
      tamil: 'Tamil Songs',
      telugu: 'Telugu Songs',
    };
    return names[categoryId] || 'Songs';
  };

  if (loading) {
    return (
      <NetworkStatus>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading music...</Text>
          </View>
        </SafeAreaView>
      </NetworkStatus>
    );
  }

  return (
    <NetworkStatus>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#3b82f6" 
            />
          }
          showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748b',
    marginTop: 16,
    fontSize: 16,
  },
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topMenuText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
});