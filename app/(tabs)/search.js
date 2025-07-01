import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Mic, MicOff, X } from 'lucide-react-native';
import { saavnAPI } from '../../services/api';
import { audioPlayer } from '../../services/audioPlayer';
import { debounce } from '../../utils/helpers';
import SongItem from '../../components/SongItem';
import MiniPlayer from '../../components/MiniPlayer';
import NetworkStatus from '../../components/NetworkStatus';

const SEARCH_TYPES = {
  ALL: 'all',
  SONGS: 'songs',
  ALBUMS: 'albums',
  ARTISTS: 'artists',
  PLAYLISTS: 'playlists',
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState(SEARCH_TYPES.SONGS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const performSearch = async (query, pageNum = 0, reset = false) => {
    if (!query.trim()) return;

    try {
      if (reset) {
        setLoading(true);
        setResults([]);
        setPage(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      let response;
      
      switch (searchType) {
        case SEARCH_TYPES.SONGS:
          response = await saavnAPI.searchSongs(query, pageNum, 20);
          break;
        case SEARCH_TYPES.ALBUMS:
          response = await saavnAPI.searchAlbums(query, pageNum, 20);
          break;
        case SEARCH_TYPES.ARTISTS:
          response = await saavnAPI.searchArtists(query, pageNum, 20);
          break;
        case SEARCH_TYPES.PLAYLISTS:
          response = await saavnAPI.searchPlaylists(query, pageNum, 20);
          break;
        default:
          response = await saavnAPI.search(query, 20);
          break;
      }

      if (response.success) {
        const newResults = searchType === SEARCH_TYPES.ALL ? 
          response.data.songs?.results || [] : 
          response.data.results || [];
        
        if (reset) {
          setResults(newResults);
        } else {
          setResults(prev => [...prev, ...newResults]);
        }
        
        setTotalResults(response.data.total || newResults.length);
        setHasMore(newResults.length === 20);
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, 0, true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setTotalResults(0);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore && searchQuery.trim() && results.length > 0) {
      performSearch(searchQuery, page, false);
    }
  };

  const playSearchResults = (startIndex = 0) => {
    if (searchType === SEARCH_TYPES.SONGS && results.length > 0) {
      audioPlayer.setQueue(results, startIndex);
      audioPlayer.loadSong(results[startIndex]);
    }
  };

  const startVoiceSearch = async () => {
    if (Platform.OS === 'web') {
      // Web Speech Recognition API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
          // Auto-search after voice input
          setTimeout(() => {
            performSearch(transcript, 0, true);
          }, 100);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
          Alert.alert('Voice Search Error', 'Could not recognize speech. Please try again.');
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        Alert.alert('Not Supported', 'Voice search is not supported in this browser.');
      }
    } else {
      Alert.alert('Voice Search', 'Voice search is not available on this platform yet.');
    }
  };

  const stopVoiceSearch = () => {
    setIsListening(false);
  };

  const renderSearchTypeButton = (type, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        searchType === type && styles.filterButtonActive,
      ]}
      onPress={() => {
        setSearchType(type);
        setPage(0);
        if (searchQuery.trim()) {
          performSearch(searchQuery, 0, true);
        }
      }}
      accessibilityLabel={`Filter by ${label}`}
accessibilityRole="button"
accessibilityState={{selected: type == searchType}}
    >
      <Text
        style={[
          styles.filterButtonText,
          searchType === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => playSearchResults(index)}
      showIndex={false}
    />
  );

  const renderOtherItem = ({ item }) => (
    <TouchableOpacity
      style={styles.otherItem}
      onPress={() => {
        console.log('Navigate to:', item);
      }}
      accessibilityLabel={`Open ${item.name || item.title}`}
    >
      <Text style={styles.otherItemTitle}>{item.name || item.title}</Text>
      <Text style={styles.otherItemSubtitle}>
        {searchType === SEARCH_TYPES.ALBUMS && `${item.year || 'Unknown year'}`}
        {searchType === SEARCH_TYPES.ARTISTS && `${item.followerCount || 'Artist'}`}
        {searchType === SEARCH_TYPES.PLAYLISTS && `${item.songCount || 0} songs`}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.emptyText}>Searching the best match for you...</Text>
        </View>
      );
    }

    if (!searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Search size={48} color="#64748b" />
          <Text style={styles.emptyText}>Search for songs, albums, artists, and playlists</Text>
          <Text style={styles.emptySubtext}>Try using voice search for hands-free searching</Text>
<Text style={styles.emptyText}>Find your favorite music by typing a song, artist, or album</Text>
<Text style={styles.emptyText}>Start typing to discover tracks and trending hits</Text>
<Text style={styles.emptyText}>Find music by mood, genre, or language in seconds</Text>
<Text style={styles.emptyText}>Browse the world of audio. Search to get started</Text>
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
<Text style={styles.emptyText}>No search yet. Try typing a song or artist you love</Text>
<Text style={styles.emptyText}>Find your favorite music by typing a song, artist, or album</Text>
<Text style={styles.emptyText}>Start typing to discover tracks and trending hits</Text>
<Text style={styles.emptyText}>Find music by mood, genre, or language in seconds</Text>
<Text style={styles.emptyText}>Browse the world of audio. Search to get started</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <NetworkStatus>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search songs, artists, albums..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
                accessibilityLabel="Clear search"
accessibilityRole="button"
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
              onPress={isListening ? stopVoiceSearch : startVoiceSearch}
              accessibilityLabel={isListening ? 'Stop listening' : 'Voice search'}
accessibilityRole="button"
            >
              {isListening ? (
                <MicOff size={20} color="#ef4444" />
              ) : (
                <Mic size={20} color="#64748b" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchSubmit}
              accessibilityLabel="Search"
accessibilityRole="button"
            >
              <Search size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
{false && (
          <View style={styles.filtersContainer}>
            {renderSearchTypeButton(SEARCH_TYPES.SONGS, 'Songs')}
            {renderSearchTypeButton(SEARCH_TYPES.ALBUMS, 'Albums')}
            {renderSearchTypeButton(SEARCH_TYPES.ARTISTS, 'Artists')}
            {renderSearchTypeButton(SEARCH_TYPES.PLAYLISTS, 'Playlists')}
          </View>
)}
        </View>

        {totalResults > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </Text>
            {searchType === SEARCH_TYPES.SONGS && results.length > 0 && (
              <TouchableOpacity
                style={styles.playAllButton}
                onPress={() => playSearchResults(0)}
                accessibilityLabel="play all"
accessibilityRole="button"
              >
                <Text style={styles.playAllText}>Play All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={results}
          renderItem={searchType === SEARCH_TYPES.SONGS ? renderSongItem : renderOtherItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={results.length === 0 ? styles.emptyList : null}
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
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#ffffff',
  },
  clearButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  voiceButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#fef2f2',
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  resultsCount: {
    color: '#64748b',
    fontSize: 14,
  },
  playAllButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  playAllText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  otherItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  otherItemTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  otherItemSubtitle: {
    color: '#64748b',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  loadingText: {
    color: '#64748b',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#475569',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyList: {
    flex: 1,
  },
});