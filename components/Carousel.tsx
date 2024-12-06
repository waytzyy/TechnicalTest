import React from 'react';
import { FlatList, View, StyleSheet, Image, Text, Animated, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const SPACING = 10;
const FIRST_ITEM_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const BACKGROUND_COLOR = 'rgb(190, 202, 196)';
const ACCENT_COLOR = '#e17055';

interface CarouselProps {
  data: Array<{
    id: string;
    title: string;
    image: string;
    content: string;
    rating: number;
    category: string;
    date: string;
    readTime: string;
    location: string;
    highlights: string[];
  }>;
  onCardPress?: (index: number) => void;
}

const CarouselView: React.FC<CarouselProps> = ({
  data,
  onCardPress = (index) => console.log('Card pressed:', index),
}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [
      (index - 2) * CARD_WIDTH,
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
      (index + 2) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 0.85, 1.1, 0.85, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 0.6, 1, 0.6, 0.4],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [40, 20, 0, 20, 40],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
        onTouchEnd={() => onCardPress(index)}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{item.category}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[...Array(Math.floor(item.rating))].map((_, i) => (
                  <Icon key={i} name="star" size={14} color="#FFD700" />
                ))}
                {item.rating % 1 > 0 && (
                  <Icon name="star-half" size={14} color="#FFD700" />
                )}
              </View>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.content} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{item.date}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{item.readTime}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.carouselTitleBold}>GYM</Text>
        <View style={styles.divider} />
        <Text style={styles.carouselDescription}>
          Transform Your Body, Transform Your Life
        </Text>
      </View>

      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate={0.85}
        pagingEnabled
        bounces={false}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingHorizontal: FIRST_ITEM_SPACING },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
      />

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Swipe to explore more</Text>
        <Icon name="swipe" size={24} color={ACCENT_COLOR} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  headerContainer: {
    paddingVertical: 30,
    marginVertical: 5,
    marginBottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginHorizontal: 15,
  },
  flatListContent: {
    alignItems: 'center',
    paddingTop: 0,
  },
  cardContainer: {
    width: 300,
    height: 490,
    marginHorizontal: SPACING / 2,
    marginVertical: -10,
    marginBottom: 10,
    borderRadius: 50,
    overflow: 'hidden',
    // backgroundColor: BACKGROUND_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    justifyContent: 'flex-end',
    padding: 25,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
    marginRight: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carouselTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: '#2d3436',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  carouselTitleBold: {
    fontSize: 36,
    fontWeight: '900',
    color: ACCENT_COLOR,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: ACCENT_COLOR,
    marginVertical: 15,
    borderRadius: 2,
  },
  carouselDescription: {
    fontSize: 10,
    color: '#636e72',
    fontWeight: '500',
    letterSpacing: 0.1,
    marginLeft: 10,
    marginRight: 10,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#636e72',
    marginTop: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#636e72',
    fontWeight: '500',
  },
});

export default CarouselView;