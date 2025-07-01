import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
ScrollView,
} from 'react-native';
import { TriangleAlert as AlertTriangle, X } from 'lucide-react-native';

export default function ClearDownloadsModal({
  visible,
  onClose,
  onConfirm,
}) {
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
            <View style={styles.iconContainer}>
              <AlertTriangle size={32} color="#ef4444" />
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
            <Text style={styles.title}>Clear All Downloads</Text>
            <Text style={styles.message}>
              Are you sure you want to clear all downloaded songs? This action cannot be undone and will free up storage space on your device.
            </Text>
<ScrollView>
<Text style={styles.message}>
  Removing downloaded files will not delete your playlists or favorites. You can re-download them anytime from your library.
</Text>

<Text style={styles.message}>
  Downloads help you listen offline, but they take up space. Clearing them is a good way to manage storage.
</Text>

<Text style={styles.message}>
  Freeing up space may improve app performance on low-storage devices. Consider clearing downloads regularly.
</Text>
</ScrollView>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              accessibilityLabel="Cancel"
accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              accessibilityLabel="Clear downloads"
accessibilityRole="button"
            >
              <Text style={styles.confirmButtonText}>Clear All</Text>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 50,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});