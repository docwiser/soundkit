import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Share,
  Platform,
} from 'react-native';
import { X, Heart, Plus, Share as ShareIcon } from 'lucide-react-native';
import { getArtistNames, createShareLink } from '../utils/helpers';

export default function ActionMenuModal({ 
  visible, 
  onClose, 
  song, 
  isFavorite, 
  onToggleFavorite, 
  onAddToPlaylist 
}) {
  const handleShare = async () => {
    try {
      const shareUrl = createShareLink(song.id, song.name);
      const shareMessage = `Check out "${song.name}" by ${getArtistNames(song.artists)} on SoundKit: ${shareUrl}`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: song.name,
            text: shareMessage,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareMessage);
        }
      } else {
        await Share.share({
          message: shareMessage,
          url: shareUrl,
          title: song.name,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!song) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Action Menu</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close action menu"
            >
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View style={styles.songInfo}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {song.name}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              by {getArtistNames(song.artists)}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionItem}
              onPress={() => {
                onToggleFavorite();
                onClose();
              }}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                color={isFavorite ? '#ef4444' : '#64748b'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
              <Text style={styles.actionText}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionItem}
              onPress={onAddToPlaylist}
              accessibilityLabel="Add to playlist"
            >
              <Plus size={20} color="#64748b" />
              <Text style={styles.actionText}>Add to Playlist</Text>
            </Pressable>

            <Pressable
              style={styles.actionItem}
              onPress={handleShare}
              accessibilityLabel="Share song"
            >
              <ShareIcon size={20} color="#64748b" />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  songInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  songTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    color: '#64748b',
    fontSize: 14,
  },
  actions: {
    paddingTop: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
  },
});