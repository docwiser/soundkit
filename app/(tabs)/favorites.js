import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { storageService } from '../../services/storage';
import { audioPlayer } from '../../services/audioPlayer';
import SongItem from '../../components/SongItem';
import MiniPlayer from '../../components/MiniPlayer';
import NetworkStatus from '../../components/NetworkStatus';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await storageService.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const playSongs = (startIndex = 0) => {
    if (favorites && favorites.length > 0) {
      audioPlayer.setQueue(favorites, startIndex);
      audioPlayer.loadSong(favorites[startIndex]);
    }
  };

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => playSongs(index)}
    />
  );

  return (
    <NetworkStatus>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favorites.length} song{favorites.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={favorites}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Heart size={48} color="#64748b" />
              <Text style={styles.emptyText}>No favorites yet</Text>
              <Text style={styles.emptySubtext}>
                Heart songs you love to find them here
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
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
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
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