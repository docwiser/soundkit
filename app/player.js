import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Share as NativeShare,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, Heart, Download, Volume2, Repeat, Shuffle, Trash2, MoveHorizontal as MoreHorizontal, ChevronDown, ChevronUp, Plus, Gauge, ListMusic, CircleHelp as HelpCircle, X, Share} from 'lucide-react-native';
import { router } from 'expo-router';
import { audioPlayer } from '../services/audioPlayer';
import { storageService } from '../services/storage';
import { saavnAPI } from '../services/api';
import { getImageUrl, getArtistNames, createShareLink } from '../utils/helpers';
import SongItem from '../components/SongItem';
import RemoveDownloadModal from '../components/RemoveDownloadModal';
import SpeedSelectionModal from '../components/SpeedSelectionModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import AudioQualityModal from '../components/AudioQualityModal';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const [playerState, setPlayerState] = useState({
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    volume: 1.0,
    playbackSpeed: 1.0,
    queue: [],
    currentIndex: 0,
    repeat: 'none',
    shuffle: false
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRemoveDownload, setShowRemoveDownload] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showSpeedSelection, setShowSpeedSelection] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [showAudioQuality, setShowAudioQuality] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const unsubscribe = audioPlayer.addListener(setPlayerState);
    loadSettings();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (playerState.currentSong) {
      checkFavoriteStatus();
      checkDownloadStatus();
      loadRecommendations();
    }
  }, [playerState.currentSong?.id]);

  useEffect(() => {
    if (!seeking) {
      setSeekPosition(playerState.position);
    }
  }, [playerState.position, seeking]);

  const loadSettings = async () => {
    const currentSettings = await storageService.getSettings();
    setSettings(currentSettings);
  };

  const checkFavoriteStatus = async () => {
    const favorites = await storageService.getFavorites();
    setIsFavorite(favorites.some(fav => fav.id === playerState.currentSong.id));
  };

  const checkDownloadStatus = async () => {
    const downloaded = await storageService.getDownloadedSongs();
    setIsDownloaded(downloaded.some(d => d.id === playerState.currentSong.id));
  };

  const loadRecommendations = async () => {
    if (!playerState.currentSong?.id) return;
    
    setLoadingRecommendations(true);
    try {
      const response = await saavnAPI.getSongSuggestions(playerState.currentSong.id, 20);
      if (response.success) {
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const toggleFavorite = async () => {
    const newFavoriteStatus = await storageService.toggleFavorite(playerState.currentSong);
    setIsFavorite(newFavoriteStatus);
  };

  const downloadSong = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const success = await audioPlayer.downloadSong(playerState.currentSong);
      if (success) {
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const removeDownload = async () => {
    try {
      await storageService.removeDownloadedSong(playerState.currentSong.id);
      setIsDownloaded(false);
      setShowRemoveDownload(false);
    } catch (error) {
      console.error('Remove download error:', error);
    }
  };

  const handleDownloadPress = () => {
    if (isDownloaded) {
      setShowRemoveDownload(true);
    } else {
      downloadSong();
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = createShareLink(playerState.currentSong.id, playerState.currentSong.name);
      const shareMessage = `Check out "${playerState.currentSong.name}" by ${getArtistNames(playerState.currentSong.artists)} on SoundKit: ${shareUrl}`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: playerState.currentSong.name,
            text: shareMessage,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareMessage);
        }
      } else {
        await NativeShare.share({
          message: shareMessage,
          url: shareUrl,
          title: playerState.currentSong.name,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekStart = () => {
    setSeeking(true);
  };

  const handleSeekChange = (value) => {
    setSeekPosition(value);
  };

  const handleSeekComplete = async (value) => {
    setSeeking(false);
    await audioPlayer.seekTo(value);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(playerState.repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    audioPlayer.setRepeat(nextMode);
  };

  const toggleShuffle = () => {
    audioPlayer.setShuffle(!playerState.shuffle);
  };

  const adjustPlaybackSpeed = (speed) => {
    audioPlayer.setPlaybackSpeed(speed);
    setShowSpeedSelection(false);
  };

  const handleRewind = () => {
    audioPlayer.rewind();
  };

  const handleFastForward = () => {
    audioPlayer.fastForward();
  };

  const removeFromQueue = (index) => {
    audioPlayer.removeFromQueue(index);
  };

  const playRecommendation = (song, index) => {
    audioPlayer.setQueue(recommendations, index);
    audioPlayer.loadSong(song);
  };

  const playQueueSong = (song, index) => {
    audioPlayer.currentIndex = index;
    audioPlayer.loadSong(song);
  };

  const renderRecommendation = ({ item, index }) => (
    <SongItem
      song={item}
      onPress={() => playRecommendation(item, index)}
      compact={true}
    />
  );

  const renderQueueItem = ({ item, index }) => (
    <View style={styles.queueItem}>
      <Pressable
        style={styles.queueSongInfo}
        onPress={() => playQueueSong(item, index)}
      >
        <Image
          source={{ uri: getImageUrl(item.image, 'small') }}
          style={styles.queueImage}
        />
        <View style={styles.queueTextInfo}>
          <Text 
            style={[
              styles.queueSongTitle,
              index === playerState.currentIndex && styles.currentSongTitle
            ]} 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.queueArtist} numberOfLines={1}>
            {getArtistNames(item.artists)}
          </Text>
        </View>
      </Pressable>
      
      <Pressable
        style={styles.removeFromQueueButton}
        onPress={() => removeFromQueue(index)}
        accessibilityLabel="Remove from queue"
        accessibilityRole="button"
      >
        <X size={16} color="#64748b" />
      </Pressable>
    </View>
  );

  const renderMoreOptionsModal = () => (
    <Modal
      visible={showMoreOptions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMoreOptions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.moreOptionsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>More Options</Text>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowMoreOptions(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={24} color="#ffffff" />
            </Pressable>
          </View>
          
          <View style={styles.optionsList}>
            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowMoreOptions(false);
                handleDownloadPress();
              }}
              accessibilityRole="button"
              accessibilityLabel={isDownloaded ? "Remove from downloads" : "Download"}
            >
              {isDownloaded ? <Trash2 size={20} color="#ef4444" /> : <Download size={20} color="#64748b" />}
              <Text style={styles.optionText}>
                {isDownloaded ? 'Remove Download' : 'Download'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowMoreOptions(false);
                setShowAddToPlaylist(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="add to playlist"
            >
              <Plus size={20} color="#64748b" />
              <Text style={styles.optionText}>Add to Playlist</Text>
            </Pressable>

            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowMoreOptions(false);
                setShowSpeedSelection(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="playback speed"
            >
              <Gauge size={20} color="#64748b" />
              <Text style={styles.optionText}>Playback Speed</Text>
            </Pressable>

            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowMoreOptions(false);
                toggleFavorite();
              }}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Remove from favorites" : "add to favorites"}
            >
              <Heart 
                size={20} 
                color={isFavorite ? '#ef4444' : '#64748b'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
              <Text style={styles.optionText}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.optionItem, isDownloaded && styles.optionItemDisabled]}
              onPress={() => {
                if (!isDownloaded) {
                  setShowMoreOptions(false);
                  setShowAudioQuality(true);
                }
              }}
              disabled={isDownloaded}
              accessibilityRole="button"
              accessibilityLabel={isDownloaded ? "you cant change audio quality, because the song is downloaded" : "Audio Quality"}
            >
              <Volume2 size={20} color={isDownloaded ? '#475569' : '#64748b'} />
              <Text style={[styles.optionText, isDownloaded && styles.optionTextDisabled]}>
                Audio Quality {isDownloaded ? '(Downloaded)' : ''}
              </Text>
            </Pressable>

            <Pressable 
              style={styles.optionItem} 
              onPress={() => {
                setShowMoreOptions(false);
                router.push('/help');
              }}
              accessibilityRole="button" 
              accessibilityLabel="Help"
            >
              <HelpCircle size={20} color="#64748b" />
              <Text style={styles.optionText}>Help</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!playerState.currentSong) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>SoundKit Player</Text>
          <Pressable 
            style={styles.backButton} 
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a', '#000000']}
        style={styles.gradient}
      >
        <FlatList
          data={[
            { type: 'player' }, 
            ...playerState.queue.map((song, index) => ({ type: 'queue', song, index })),
            { type: 'recommendations-header' },
            ...recommendations.map(song => ({ type: 'recommendation', song }))
          ]}
          renderItem={({ item, index }) => {
            if (item.type === 'player') {
              return (
                <View style={styles.playerContainer}>
                  {/* Player Interface - Top 50% */}
                  <Pressable 
                    style={styles.playerInterface}
                    onPress={() => setShowControls(!showControls)}
                    accessibilityLabel="SoundKit player"
                    accessibilityHint={showControls ? "Double-tap to hide controls" : "Double-tap to show controls"}
                  >
                    {/* Artwork */}
                    <View style={styles.artworkContainer}>
                      <Image
                        source={{ uri: getImageUrl(playerState.currentSong.image, 'high') }}
                        style={styles.artwork}
                      />
                    </View>

                    {/* Controls Overlay */}
                    {showControls && (
                      <View style={styles.controlsOverlay}>
                        {/* Top Controls */}
                        <View style={styles.topControls}>
                          <Pressable
                            style={styles.topControlButton}
                            onPress={() => router.back()}
                            accessibilityLabel="Minimize"
                            accessibilityRole="button"
                          >
                            <ChevronDown size={24} color="#ffffff" />
                          </Pressable>
                          
                          <View style={styles.topControlsRight}>
                            <Pressable
                              style={styles.topControlButton}
                              onPress={handleShare}
                              accessibilityLabel="Share"
                              accessibilityRole="button"
                            >
                              <Share size={24} color="#ffffff" />
                            </Pressable>
                            
                            <Pressable
                              style={styles.topControlButton}
                              onPress={() => setShowMoreOptions(true)}
                              accessibilityLabel="More options"
                              accessibilityRole="button"
                            >
                              <MoreHorizontal size={24} color="#ffffff" />
                            </Pressable>
                          </View>
                        </View>

                        {/* Main Controls - 5 buttons in a row */}
                        <View style={styles.mainControls}>
                          <Pressable
                            style={styles.controlButton}
                            onPress={() => audioPlayer.playPrevious()}
                            accessibilityLabel="Previous"
                            accessibilityRole="button"
                          >
                            <SkipBack size={28} color="#ffffff" />
                          </Pressable>
                          
                          <Pressable
                            style={styles.controlButton}
                            onPress={handleRewind}
                            accessibilityLabel={`Rewind ${settings?.rewindDuration || 10} seconds`}
                            accessibilityRole="button"
                          >
                            <RotateCcw size={24} color="#ffffff" />
                          </Pressable>
                          
                          <Pressable
                            style={[styles.controlButton, styles.playButton]}
                            onPress={() => audioPlayer.togglePlayPause()}
                            accessibilityLabel={playerState.isPlaying ? 'Pause' : 'Play'}
                            accessibilityRole="button"
                          >
                            {playerState.isPlaying ? (
                              <Pause size={32} color="#ffffff" />
                            ) : (
                              <Play size={32} color="#ffffff" />
                            )}
                          </Pressable>
                          
                          <Pressable
                            style={styles.controlButton}
                            onPress={handleFastForward}
                            accessibilityLabel={`Fast forward ${settings?.fastForwardDuration || 10} seconds`}
                            accessibilityRole="button"
                          >
                            <FastForward size={24} color="#ffffff" />
                          </Pressable>
                          
                          <Pressable
                            style={styles.controlButton}
                            onPress={() => audioPlayer.playNext()}
                            accessibilityLabel="Next"
                            accessibilityRole="button"
                          >
                            <SkipForward size={28} color="#ffffff" />
                          </Pressable>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                          <Slider
                            style={styles.progressSlider}
                            value={seekPosition}
                            maximumValue={playerState.duration}
                            onSlidingStart={handleSeekStart}
                            onValueChange={handleSeekChange}
                            onSlidingComplete={handleSeekComplete}
                            minimumTrackTintColor="#3b82f6"
                            maximumTrackTintColor="rgba(255,255,255,0.3)"
                            thumbStyle={styles.sliderThumb}
                            accessibilityLabel={`${formatTime(seekPosition)} of ${formatTime(playerState.duration)}`}
                          />
                          <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>
                              {formatTime(seekPosition)} of {formatTime(playerState.duration)}
                            </Text>
                          </View>
                        </View>

                        {/* Secondary Controls */}
                        <View style={styles.secondaryControls}>
                          <Pressable
                            style={styles.secondaryButton}
                            onPress={toggleShuffle}
                            accessibilityLabel={`Shuffle ${playerState.shuffle ? 'on' : 'off'}`}
                            accessibilityRole="button"
                          >
                            <Shuffle
                              size={20}
                              color={playerState.shuffle ? '#3b82f6' : 'rgba(255,255,255,0.7)'}
                            />
                          </Pressable>
                          
                          <Pressable
                            style={styles.secondaryButton}
                            onPress={toggleRepeat}
                            accessibilityLabel={`Repeat ${playerState.repeat}`}
                            accessibilityRole="button"
                          >
                            <Repeat
                              size={20}
                              color={playerState.repeat !== 'none' ? '#3b82f6' : 'rgba(255,255,255,0.7)'}
                            />
                          </Pressable>
                        </View>
                      </View>
                    )}

                    {/* Show/Hide Controls Indicator */}
                    <View style={styles.controlsIndicator}>
                      {showControls ? (
                        <ChevronUp size={16} color="rgba(255,255,255,0.5)" />
                      ) : (
                        <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                      )}
                    </View>
                  </Pressable>

                  {/* Song Info */}
                  <View style={styles.songInfoSection}>
                    <Text style={styles.songTitle} numberOfLines={2}>
                      {playerState.currentSong.name}
                    </Text>
                    <Text style={styles.artistName} numberOfLines={1}>
                      {getArtistNames(playerState.currentSong.artists)}
                    </Text>
                    {playerState.currentSong.album?.name && (
                      <Text style={styles.albumName} numberOfLines={1}>
                        {playerState.currentSong.album.name}
                      </Text>
                    )}
                  </View>

                  {/* Queue Header */}
                  {playerState.queue.length > 0 && (
                    <View style={styles.queueHeader}>
                      <Text style={styles.queueTitle}>Playing Queue</Text>
                      <Text style={styles.queueSubtitle}>
                        {playerState.queue.length} song{playerState.queue.length !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </View>
              );
            } else if (item.type === 'queue') {
              return renderQueueItem({ item: item.song, index: item.index });
            } else if (item.type === 'recommendations-header') {
              return recommendations.length > 0 ? (
                <View style={styles.queueHeader}>
                  <Text style={styles.queueTitle}>Up Next</Text>
                  <Text style={styles.queueSubtitle}>
                    {recommendations.length} song{recommendations.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              ) : null;
            } else {
              return renderRecommendation({ item: item.song, index: index - playerState.queue.length - 2 });
            }
          }}
          keyExtractor={(item, index) => {
            if (item.type === 'player') return 'player';
            if (item.type === 'queue') return `queue-${item.song.id}-${item.index}`;
            if (item.type === 'recommendations-header') return 'recommendations-header';
            return `rec-${item.song.id}-${index}`;
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
      </LinearGradient>

      {renderMoreOptionsModal()}

      <RemoveDownloadModal
        visible={showRemoveDownload}
        onClose={() => setShowRemoveDownload(false)}
        onConfirm={removeDownload}
        songName={playerState.currentSong?.name}
      />

      <SpeedSelectionModal
        visible={showSpeedSelection}
        onClose={() => setShowSpeedSelection(false)}
        currentSpeed={playerState.playbackSpeed}
        onSelectSpeed={adjustPlaybackSpeed}
      />

      <AddToPlaylistModal
        visible={showAddToPlaylist}
        onClose={() => setShowAddToPlaylist(false)}
        song={playerState.currentSong}
      />

      <AudioQualityModal
        visible={showAudioQuality}
        onClose={() => setShowAudioQuality(false)}
        currentSong={playerState.currentSong}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  playerContainer: {
    flex: 1,
  },
  playerInterface: {
    height: height * 0.5,
    position: 'relative',
  },
  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  artwork: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topControlsRight: {
    flexDirection: 'row',
    gap: 16,
  },
  topControlButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#3b82f6',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    padding: 12,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  playButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 40,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlsIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  songInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artistName: {
    color: '#64748b',
    fontSize: 18,
    marginBottom: 4,
  },
  albumName: {
    color: '#475569',
    fontSize: 16,
  },
  queueHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  queueTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  queueSubtitle: {
    color: '#64748b',
    fontSize: 14,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  queueSongInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  queueImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  queueTextInfo: {
    flex: 1,
  },
  queueSongTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentSongTitle: {
    color: '#3b82f6',
  },
  queueArtist: {
    color: '#64748b',
    fontSize: 14,
  },
  removeFromQueueButton: {
    padding: 8,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  moreOptionsModal: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 4,
  },
  optionsList: {
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  optionItemDisabled: {
    opacity: 0.5,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
  optionTextDisabled: {
    color: '#475569',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});