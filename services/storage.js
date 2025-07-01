import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const KEYS = {
  PLAYLISTS: 'soundkit_playlists',
  DOWNLOADED_SONGS: 'soundkit_downloaded_songs',
  SETTINGS: 'soundkit_settings',
  RECENTLY_PLAYED: 'soundkit_recently_played',
  FAVORITES: 'soundkit_favorites',
  PLAYBACK_HISTORY: 'soundkit_playback_history'
};

export const storageService = {
  // Playlists
  getPlaylists: async () => {
    try {
      const playlists = await AsyncStorage.getItem(KEYS.PLAYLISTS);
      return playlists ? JSON.parse(playlists) : [];
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  },

  savePlaylists: async (playlists) => {
    try {
      await AsyncStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
      return true;
    } catch (error) {
      console.error('Error saving playlists:', error);
      return false;
    }
  },

  createPlaylist: async (name, description = '') => {
    try {
      const playlists = await storageService.getPlaylists();
      const newPlaylist = {
        id: Date.now().toString(),
        name,
        description,
        songs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      playlists.push(newPlaylist);
      await storageService.savePlaylists(playlists);
      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  },

  addSongToPlaylist: async (playlistId, song) => {
    try {
      const playlists = await storageService.getPlaylists();
      const playlistIndex = playlists.findIndex(p => p.id === playlistId);
      if (playlistIndex !== -1) {
        if (!playlists[playlistIndex].songs.find(s => s.id === song.id)) {
          playlists[playlistIndex].songs.push(song);
          playlists[playlistIndex].updatedAt = new Date().toISOString();
          await storageService.savePlaylists(playlists);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      return false;
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      const playlists = await storageService.getPlaylists();
      const playlistIndex = playlists.findIndex(p => p.id === playlistId);
      if (playlistIndex !== -1) {
        playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(s => s.id !== songId);
        playlists[playlistIndex].updatedAt = new Date().toISOString();
        await storageService.savePlaylists(playlists);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      return false;
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      const playlists = await storageService.getPlaylists();
      const filteredPlaylists = playlists.filter(p => p.id !== playlistId);
      await storageService.savePlaylists(filteredPlaylists);
      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      return false;
    }
  },

  // Downloaded songs
  getDownloadedSongs: async () => {
    try {
      const downloaded = await AsyncStorage.getItem(KEYS.DOWNLOADED_SONGS);
      return downloaded ? JSON.parse(downloaded) : [];
    } catch (error) {
      console.error('Error getting downloaded songs:', error);
      return [];
    }
  },

  saveDownloadedSongs: async (songs) => {
    try {
      await AsyncStorage.setItem(KEYS.DOWNLOADED_SONGS, JSON.stringify(songs));
      return true;
    } catch (error) {
      console.error('Error saving downloaded songs:', error);
      return false;
    }
  },

  addDownloadedSong: async (song, localUri) => {
    try {
      const downloaded = await storageService.getDownloadedSongs();
      const downloadedSong = {
        ...song,
        localUri,
        downloadedAt: new Date().toISOString()
      };
      downloaded.push(downloadedSong);
      await AsyncStorage.setItem(KEYS.DOWNLOADED_SONGS, JSON.stringify(downloaded));
      return true;
    } catch (error) {
      console.error('Error adding downloaded song:', error);
      return false;
    }
  },

  removeDownloadedSong: async (songId) => {
    try {
      const downloaded = await storageService.getDownloadedSongs();
      const song = downloaded.find(s => s.id === songId);
      if (song && song.localUri) {
        await FileSystem.deleteAsync(song.localUri, { idempotent: true });
      }
      const filteredDownloaded = downloaded.filter(s => s.id !== songId);
      await AsyncStorage.setItem(KEYS.DOWNLOADED_SONGS, JSON.stringify(filteredDownloaded));
      
      // Also remove from favorites if it exists there
      const favorites = await storageService.getFavorites();
      const filteredFavorites = favorites.filter(s => s.id !== songId);
      if (filteredFavorites.length !== favorites.length) {
        await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(filteredFavorites));
      }
      
      return true;
    } catch (error) {
      console.error('Error removing downloaded song:', error);
      return false;
    }
  },

  // Settings
  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {
        audioQuality: 'medium',
        thumbnailSize: 'medium',
        rewindDuration: 10,
        fastForwardDuration: 10,
        playbackSpeed: 1.0,
        autoplay: true,
        downloadQuality: 'medium',
        darkMode: true
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  // Recently played
  addToRecentlyPlayed: async (song) => {
    try {
      const recent = await AsyncStorage.getItem(KEYS.RECENTLY_PLAYED);
      let recentlyPlayed = recent ? JSON.parse(recent) : [];
      
      // Remove if already exists
      recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
      
      // Add to beginning
      recentlyPlayed.unshift({
        ...song,
        playedAt: new Date().toISOString()
      });
      
      // Keep only last 50
      recentlyPlayed = recentlyPlayed.slice(0, 50);
      
      await AsyncStorage.setItem(KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
      return true;
    } catch (error) {
      console.error('Error adding to recently played:', error);
      return false;
    }
  },

  getRecentlyPlayed: async () => {
    try {
      const recent = await AsyncStorage.getItem(KEYS.RECENTLY_PLAYED);
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Error getting recently played:', error);
      return [];
    }
  },

  // Playback history
  addToPlaybackHistory: async (song) => {
    try {
      const history = await AsyncStorage.getItem(KEYS.PLAYBACK_HISTORY);
      let playbackHistory = history ? JSON.parse(history) : [];
      
      // Remove if already exists
      playbackHistory = playbackHistory.filter(s => s.id !== song.id);
      
      // Add to beginning with timestamp
      playbackHistory.unshift({
        ...song,
        playedAt: new Date().toISOString()
      });
      
      // Keep only last 100
      playbackHistory = playbackHistory.slice(0, 100);
      
      await AsyncStorage.setItem(KEYS.PLAYBACK_HISTORY, JSON.stringify(playbackHistory));
      return true;
    } catch (error) {
      console.error('Error adding to playback history:', error);
      return false;
    }
  },

  getPlaybackHistory: async () => {
    try {
      const history = await AsyncStorage.getItem(KEYS.PLAYBACK_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting playback history:', error);
      return [];
    }
  },

  clearPlaybackHistory: async () => {
    try {
      await AsyncStorage.removeItem(KEYS.PLAYBACK_HISTORY);
      return true;
    } catch (error) {
      console.error('Error clearing playback history:', error);
      return false;
    }
  },

  // Favorites
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  toggleFavorite: async (song) => {
    try {
      const favorites = await storageService.getFavorites();
      const isAlreadyFavorite = favorites.find(s => s.id === song.id);
      
      let updatedFavorites;
      if (isAlreadyFavorite) {
        updatedFavorites = favorites.filter(s => s.id !== song.id);
        
        // Also remove from downloads if it exists there
        const downloaded = await storageService.getDownloadedSongs();
        const filteredDownloaded = downloaded.filter(s => s.id !== song.id);
        if (filteredDownloaded.length !== downloaded.length) {
          await AsyncStorage.setItem(KEYS.DOWNLOADED_SONGS, JSON.stringify(filteredDownloaded));
        }
      } else {
        updatedFavorites = [...favorites, { ...song, favoritedAt: new Date().toISOString() }];
      }
      
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updatedFavorites));
      return !isAlreadyFavorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }
};