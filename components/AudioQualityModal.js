import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { X, Volume2 } from 'lucide-react-native';
import { storageService } from '../services/storage';
import { audioPlayer } from '../services/audioPlayer';

const QUALITY_OPTIONS = [
  { label: 'Low (96kbps)', value: 'low', description: 'Saves data, lower quality' },
  { label: 'Medium (160kbps)', value: 'medium', description: 'Balanced quality and data usage' },
  { label: 'High (320kbps)', value: 'high', description: 'Best quality, uses more data' },
];

export default function AudioQualityModal({
  visible,
  onClose,
  currentSong,
}) {
  const [currentQuality, setCurrentQuality] = useState('medium');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCurrentQuality();
    }
  }, [visible]);

  const loadCurrentQuality = async () => {
    const settings = await storageService.getSettings();
    setCurrentQuality(settings.audioQuality || 'medium');
  };

  const changeQuality = async (newQuality) => {
    if (newQuality === currentQuality || !currentSong) return;

    setIsChanging(true);
    try {
      // Update settings
      const settings = await storageService.getSettings();
      const newSettings = { ...settings, audioQuality: newQuality };
      await storageService.saveSettings(newSettings);

      // Reload current song with new quality
      const wasPlaying = audioPlayer.isPlaying;
      const currentPosition = audioPlayer.position;
      
      await audioPlayer.loadSong(currentSong, false);
      await audioPlayer.seekTo(currentPosition);
      
      if (wasPlaying) {
        await audioPlayer.play();
      }

      setCurrentQuality(newQuality);
      
      Alert.alert(
        'Quality Changed',
        `Audio quality changed to ${QUALITY_OPTIONS.find(q => q.value === newQuality)?.label}. The current song has been reloaded.`
      );
      
      onClose();
    } catch (error) {
      console.error('Error changing audio quality:', error);
      Alert.alert('Error', 'Failed to change audio quality. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Volume2 size={24} color="#3b82f6" />
              <Text style={styles.title}>Audio Quality</Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <X size={24} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              Choose the audio quality for streaming. Higher quality uses more data but sounds better.
            </Text>

            <View style={styles.qualityOptions}>
              {QUALITY_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    currentQuality === option.value && styles.qualityOptionActive,
                  ]}
                  onPress={() => changeQuality(option.value)}
                  disabled={isChanging}
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: currentQuality === option.value }}
                >
                  <View style={styles.qualityInfo}>
                    <Text
                      style={[
                        styles.qualityLabel,
                        currentQuality === option.value && styles.qualityLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.qualityDescription}>
                      {option.description}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.radioButton,
                    currentQuality === option.value && styles.radioButtonActive,
                  ]}>
                    {currentQuality === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <Text style={styles.note}>
              Note: Changing quality will reload the current song. Downloaded songs are not affected by this setting.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  qualityOptions: {
    gap: 12,
    marginBottom: 24,
  },
  qualityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  qualityOptionActive: {
    backgroundColor: '#1e40af',
    borderColor: '#3b82f6',
  },
  qualityInfo: {
    flex: 1,
  },
  qualityLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  qualityLabelActive: {
    color: '#ffffff',
  },
  qualityDescription: {
    color: '#64748b',
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  note: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});