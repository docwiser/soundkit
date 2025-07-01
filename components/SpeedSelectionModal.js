import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x (Normal)', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
{label: "1.75x", value: 1.75},
  { label: '2x', value: 2.0 },
{label: "2.25x", value: 2.25},
{label: "2.5x", value: 2.5},
{label: "2.75x", value: 2.75},
{label: "3x", value: 3.0},
];

export default function SpeedSelectionModal({
  visible,
  onClose,
  currentSpeed,
  onSelectSpeed,
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
            <Text style={styles.title}>Playback Speed</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close"
accessibilityRole="button"
            >
              <X size={24} color="#ffffff" />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {SPEED_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionButton,
                  currentSpeed === option.value && styles.optionButtonActive,
                ]}
                onPress={() => onSelectSpeed(option.value)}
                accessibilityLabel={option.label}
accessibilityState={{selected: currentSpeed == option.value}}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentSpeed === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
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
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});