import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { X, Plus, Music } from 'lucide-react-native';
import { storageService } from '../services/storage';

export default function AddToPlaylistModal({ visible, onClose, song }) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  useEffect(() => {
    if (visible) {
      loadPlaylists();
    }
  }, [visible]);

  const loadPlaylists = async () => {
    const playlistsData = await storageService.getPlaylists();
    setPlaylists(playlistsData);
  };

  const addToPlaylist = async (playlistId) => {
    const success = await storageService.addSongToPlaylist(playlistId, song);
    if (success) {
      Alert.alert('Success', `Added "${song.name}" to playlist`);
      onClose();
    } else {
      Alert.alert('Error', 'Song is already in this playlist or an error occurred');
    }
  };

  const createAndAddToPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    const playlist = await storageService.createPlaylist(
      newPlaylistName.trim(),
      newPlaylistDescription.trim()
    );

    if (playlist) {
      await storageService.addSongToPlaylist(playlist.id, song);
      Alert.alert('Success', `Created playlist "${playlist.name}" and added song`);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateForm(false);
      onClose();
    } else {
      Alert.alert('Error', 'Failed to create playlist');
    }
  };

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => addToPlaylist(item.id)}
      accessibilityLabel={`Add to ${item.name} playlist`}
      accessibilityRole="button"
    >
      <View style={styles.playlistIcon}>
        <Music size={20} color="#3b82f6" />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>
          {item.songs.length} song{item.songs.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.title}>Add to Playlist</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {song && (
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {song.name}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {song.artists?.primary?.[0]?.name || 'Unknown Artist'}
              </Text>
            </View>
          )}

          {!showCreateForm ? (
            <>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateForm(true)}
                accessibilityLabel="Create new playlist"
                accessibilityRole="button"
              >
                <Plus size={20} color="#3b82f6" />
                <Text style={styles.createButtonText}>Create New Playlist</Text>
              </TouchableOpacity>

              <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => item.id}
                style={styles.playlistsList}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Music size={48} color="#64748b" />
                    <Text style={styles.emptyText}>No playlists yet</Text>
                    <Text style={styles.emptySubtext}>
                      Create your first playlist to add songs
                    </Text>
                  </View>
                )}
              />
            </>
          ) : (
            <View style={styles.createForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Playlist Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  placeholder="Enter playlist name"
                  placeholderTextColor="#64748b"
                  maxLength={100}
                  accessibilityLabel="Playlist name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newPlaylistDescription}
                  onChangeText={setNewPlaylistDescription}
                  placeholder="Add a description"
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                  accessibilityLabel="Playlist description"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                  }}
                  accessibilityLabel="Cancel"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.createPlaylistButton]}
                  onPress={createAndAddToPlaylist}
                  accessibilityLabel="Create playlist and add song"
                  accessibilityRole="button"
                >
                  <Text style={styles.createPlaylistButtonText}>Create & Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  createButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  playlistsList: {
    maxHeight: 300,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  playlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#334155',
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
    marginBottom: 2,
  },
  playlistCount: {
    color: '#64748b',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
  createForm: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  createPlaylistButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  createPlaylistButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});