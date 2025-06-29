import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { X } from 'lucide-react-native';

const MAIN_CATEGORIES = [
  { id: 'trending', name: 'Trending', query: 'trending' },
  { id: 'hindi', name: 'Hindi', query: 'hindi songs' },
  { id: 'romantic', name: 'Romantic', query: 'romantic songs' },
  { id: 'bollywood', name: 'Bollywood', query: 'bollywood' },
  { id: 'punjabi', name: 'Punjabi', query: 'punjabi songs' },
  { id: 'english', name: 'English', query: 'english songs' },
  { id: 'tamil', name: 'Tamil', query: 'tamil songs' },
  { id: 'telugu', name: 'Telugu', query: 'telugu songs' },
];

const MORE_CATEGORIES = [
  { id: 'classical', name: 'Classical', query: 'classical music' },
  { id: 'devotional', name: 'Devotional', query: 'devotional songs' },
  { id: 'ghazal', name: 'Ghazal', query: 'ghazal' },
  { id: 'qawwali', name: 'Qawwali', query: 'qawwali' },
  { id: 'sufi', name: 'Sufi', query: 'sufi music' },
  { id: 'folk', name: 'Folk', query: 'folk songs' },
  { id: 'indie', name: 'Indie', query: 'indie music' },
  { id: 'rock', name: 'Rock', query: 'rock music' },
  { id: 'pop', name: 'Pop', query: 'pop songs' },
  { id: 'jazz', name: 'Jazz', query: 'jazz music' },
  { id: 'blues', name: 'Blues', query: 'blues music' },
  { id: 'electronic', name: 'Electronic', query: 'electronic music' },
  { id: 'rap', name: 'Rap', query: 'rap songs' },
  { id: 'reggae', name: 'Reggae', query: 'reggae music' },
  { id: 'country', name: 'Country', query: 'country music' },
];

export default function CategorySelector({ selectedCategory, onCategorySelect }) {
  const [showMoreModal, setShowMoreModal] = useState(false);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive,
      ]}
      onPress={() => onCategorySelect(item)}
      accessibilityLabel={`Select ${item.name} category`}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedCategory === item.id }}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMoreCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.moreCategoryButton}
      onPress={() => {
        onCategorySelect(item);
        setShowMoreModal(false);
      }}
      accessibilityLabel={`Select ${item.name} category`}
      accessibilityRole="button"
    >
      <Text style={styles.moreCategoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MAIN_CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        accessibilityLabel="Music categories"
      />
      
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMoreModal(true)}
        accessibilityLabel="Show more categories"
        accessibilityRole="button"
      >
        <Text style={styles.moreButtonText}>More</Text>
      </TouchableOpacity>

      <Modal
        visible={showMoreModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>More Categories</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMoreModal(false)}
                accessibilityLabel="Close categories modal"
                accessibilityRole="button"
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MORE_CATEGORIES}
              renderItem={renderMoreCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.moreCategoriesList}
              accessibilityLabel="Additional music categories"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  moreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 20,
  },
  moreButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  moreCategoriesList: {
    padding: 20,
    gap: 12,
  },
  moreCategoryButton: {
    flex: 1,
    margin: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  moreCategoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});