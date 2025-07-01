import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { Download, MoveVertical as MoreVertical, Play, Trash2 } from 'lucide-react-native';
import { getImageUrl, getArtistNames, formatDetailedDuration, formatViewCount, formatSongYear, formatTimeAgo } from '../utils/helpers';
import { storageService } from '../services/storage';
import { audioPlayer } from '../services/audioPlayer';
import AddToPlaylistModal from './AddToPlaylistModal';
import DownloadProgress from './DownloadProgress';
import ActionMenuModal from './ActionMenuModal';
import RemoveDownloadModal from './RemoveDownloadModal';

export default function SongItem({ 
  song, 
  onPress, 
  showIndex = false,
  compact = false
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showRemoveDownload, setShowRemoveDownload] = useState(false);

  React.useEffect(() => {
    checkFavoriteStatus();
    checkDownloadStatus();
  }, [song.id]);

  const checkFavoriteStatus = async () => {
    const favorites = await storageService.getFavorites();
    setIsFavorite(favorites.some(fav => fav.id === song.id));
  };

  const checkDownloadStatus = async () => {
    const downloaded = await storageService.getDownloadedSongs();
    setIsDownloaded(downloaded.some(d => d.id === song.id));
  };

  const toggleFavorite = async () => {
    const newFavoriteStatus = await storageService.toggleFavorite(song);
    setIsFavorite(newFavoriteStatus);
  };

  const downloadSong = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const success = await audioPlayer.downloadSong(song, (progress) => {
        setDownloadProgress(progress);
      });
      
      if (success) {
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const removeDownload = async () => {
    try {
      await storageService.removeDownloadedSong(song.id);
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

  const handleActionMenu = () => {
    setShowActionMenu(true);
  };

  // Format song details in the new format
  const formatSongDetails = () => {
    const parts = [];
    
    // Duration
    if (song.duration) {
      const durationInSeconds = Math.floor(song.duration / 1000);
      parts.push(formatDetailedDuration(durationInSeconds));
    }
    
    // View count
    if (song.playCount) {
      parts.push(`${formatViewCount(song.playCount)} views`);
    }
    
    // Time ago or year
    if (song.playedAt) {
      const timeAgo = formatTimeAgo(song.playedAt);
      parts.push(`Last played ${timeAgo}`);
    } else if (song.year) {
      parts.push(`Released ${formatSongYear(song.year)}`);
    }
    
    return parts.join(' • ');
  };

  if (compact) {
    return (
      <>
        <Pressable style={styles.compactContainer} onPress={onPress}>
          <Image
            source={{ uri: getImageUrl(song.image, 'medium') }}
            style={styles.compactImage}
          />
          
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {song.name} by {song.album?.name || 'Unknown Album'}
            </Text>
            <View style={styles.compactMeta}>
              <Text style={styles.metaText}>
                {formatSongDetails()}
              </Text>
            </View>
            <Text style={styles.compactArtist} numberOfLines={1}>
              Artists: {getArtistNames(song.artists)}
            </Text>
          </View>
          
          <View style={styles.compactActions}>
            <Pressable
              style={styles.compactActionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDownloadPress();
              }}
              disabled={isDownloading}
              accessibilityRole="button"
              accessibilityLabel={isDownloaded ? 'Remove download' : 'Download'}
            >
              {isDownloading ? (
                <DownloadProgress progress={downloadProgress} visible={true} />
              ) : isDownloaded ? (
                <Trash2 size={16} color="#ef4444" />
              ) : (
                <Download size={16} color="#64748b" />
              )}
            </Pressable>
            
            <Pressable
              style={styles.compactActionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleActionMenu();
              }}
              accessibilityRole="button"
              accessibilityLabel="Action menu"
            >
              <MoreVertical size={16} color="#64748b" />
            </Pressable>
            
            <Pressable
              style={[styles.compactActionButton, styles.playButton]}
              onPress={(e) => {
                e.stopPropagation();
                onPress();
              }}
            >
              <Play size={16} color="#ffffff" />
            </Pressable>
          </View>
        </Pressable>

        <ActionMenuModal
          visible={showActionMenu}
          onClose={() => setShowActionMenu(false)}
          song={song}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onAddToPlaylist={() => {
            setShowActionMenu(false);
            setShowPlaylistModal(true);
          }}
        />

        <AddToPlaylistModal
          visible={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          song={song}
        />

        <RemoveDownloadModal
          visible={showRemoveDownload}
          onClose={() => setShowRemoveDownload(false)}
          onConfirm={removeDownload}
          songName={song.name}
        />
      </>
    );
  }

  return (
    <>
      <Pressable style={styles.container} onPress={onPress}>
        <View style={styles.content}>
          <Image
            source={{ uri: getImageUrl(song.image, 'medium') }}
            style={styles.image}
          />
          
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {song.name} by {song.album?.name || 'Unknown Album'}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              {formatSongDetails()}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              Artists: {getArtistNames(song.artists)}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDownloadPress();
              }}
              disabled={isDownloading}
              accessibilityRole="button"
              accessibilityLabel={isDownloaded ? 'Remove download' : 'Download song'}
            >
              {isDownloading ? (
                <DownloadProgress progress={downloadProgress} visible={true} />
              ) : isDownloaded ? (
                <Trash2 size={20} color="#ef4444" />
              ) : (
                <Download size={20} color="#64748b" />
              )}
            </Pressable>
            
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleActionMenu();
              }}
              accessibilityRole="button"
              accessibilityLabel="Action menu"
            >
              <MoreVertical size={20} color="#64748b" />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <ActionMenuModal
        visible={showActionMenu}
        onClose={() => setShowActionMenu(false)}
        song={song}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onAddToPlaylist={() => {
          setShowActionMenu(false);
          setShowPlaylistModal(true);
        }}
      />

      <AddToPlaylistModal
        visible={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        song={song}
      />

      <RemoveDownloadModal
        visible={showRemoveDownload}
        onClose={() => setShowRemoveDownload(false)}
        onConfirm={removeDownload}
        songName={song.name}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 4,
  },
  artist: {
    color: '#64748b',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  compactImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  compactInfo: {
    flex: 1,
    marginRight: 12,
  },
  compactTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactMeta: {
    marginBottom: 2,
  },
  metaText: {
    color: '#64748b',
    fontSize: 12,
  },
  compactArtist: {
    color: '#64748b',
    fontSize: 12,
  },
  compactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactActionButton: {
    padding: 6,
    borderRadius: 16,
  },
  playButton: {
    backgroundColor: '#3b82f6',
  },
});