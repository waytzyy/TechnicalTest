import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import ExpandedCard from './ExpandedCard';

interface CardProps {
  items: { 
    id: string; 
    title: string; 
    image: string;
    content: string; 
    rating?: number;
    category?: string;
    date?: string;
    readTime?: string;
  }[];
}

const Card: React.FC<CardProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<null | { id: string; title: string; image: string }>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const flatListRef = useRef<FlatList>(null);

  const handlePress = (item: { id: string; title: string; image: string }, event: any) => {
    const { pageY } = event.nativeEvent;
    setCardPosition({ x: 0, y: pageY });
    setSelectedItem(item);
  };

  const handleClose = () => {
    if (selectedItem && flatListRef.current) {
      const index = items.findIndex(item => item.id === selectedItem.id);
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
    setSelectedItem(null);
  };

  const renderCard = ({ item }: { item: CardProps['items'][0] }) => (
    <TouchableOpacity onPress={(event) => handlePress(item, event)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      {item.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaContainer}>
          {item.date && (
            <Text style={styles.metaText}>{item.date}</Text>
          )}
          {item.readTime && (
            <Text style={styles.metaText}>• {item.readTime} read</Text>
          )}
        </View>
        <Text style={styles.content} numberOfLines={3}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={items}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />

      {selectedItem && (
        <Modal visible transparent>
          <ExpandedCard item={selectedItem} onClose={handleClose} initialPosition={cardPosition} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 150,
  },
  textContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginRight: 5,
  },
});

export default Card;