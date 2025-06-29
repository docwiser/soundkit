import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { audioPlayer } from '../services/audioPlayer';
import { getImageUrl, getArtistNames } from '../utils/helpers';

const { width, height } = Dimensions.get('window');

export default function MiniPlayer() {
  const [playerState, setPlayerState] = useState({
    currentSong: null,
    isPlaying: false,
    position: 0,
    duration: 0,
  });

  useEffect(() => {
    const unsubscribe = audioPlayer.addListener(setPlayerState);
    return unsubscribe;
  }, []);

  const closeMiniPlayer = async () => {
    await audioPlayer.stop();
  };

  const handleMiniPlayerPress = () => {
    router.push('/player');
  };

  if (!playerState.currentSong) {
    return null;
  }

  const progress = playerState.duration > 0 ? playerState.position / playerState.duration : 0;

  return (
    <Pressable
      style={styles.container}
      onPress={handleMiniPlayerPress}
      accessibilityLabel="Soundkit player"
      accessibilityHint="Double-tap to show controls"
    >
      <BlurView style={styles.blur} intensity={80} tint="dark">
        <View style={styles.content}>
          <Image
            source={{ uri: getImageUrl(playerState.currentSong.image, 'small') }}
            style={styles.artwork}
          />
          
          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {playerState.currentSong.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {getArtistNames(playerState.currentSong.artists)}
            </Text>
          </View>
          
          <View style={styles.controls}>
            <Pressable
              style={styles.controlButton}
              onPress={(e) => {
                e.stopPropagation();
                audioPlayer.playPrevious();
              }}
              accessibilityLabel="Previous song"
            >
              <SkipBack size={20} color="#ffffff" />
            </Pressable>
            
            <Pressable
              style={[styles.controlButton, styles.playButton]}
              onPress={(e) => {
                e.stopPropagation();
                audioPlayer.togglePlayPause();
              }}
              accessibilityLabel={playerState.isPlaying ? 'Pause' : 'Play'}
            >
              {playerState.isPlaying ? (
                <Pause size={20} color="#ffffff" />
              ) : (
                <Play size={20} color="#ffffff" />
              )}
            </Pressable>
            
            <Pressable
              style={styles.controlButton}
              onPress={(e) => {
                e.stopPropagation();
                audioPlayer.playNext();
              }}
              accessibilityLabel="Next song"
            >
              <SkipForward size={20} color="#ffffff" />
            </Pressable>
            
            <Pressable
              style={styles.controlButton}
              onPress={(e) => {
                e.stopPropagation();
                closeMiniPlayer();
              }}
              accessibilityLabel="Close player"
            >
              <X size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Above tab bar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  blur: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  songInfo: {
    flex: 1,
    marginRight: 16,
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  artistName: {
    color: '#64748b',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    padding: 8,
    borderRadius: 20,
  },
  playButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#1e293b',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
});