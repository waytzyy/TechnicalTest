import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Alert 
} from 'react-native';
import { 
  Gesture, 
  GestureDetector, 
  GestureHandlerRootView 
} from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue, 
  runOnJS 
} from 'react-native-reanimated';

interface ExpandedCardProps {
  item: { 
    id: string; 
    title: string; 
    image: string; 
    description?: string; 
    category?: string;
    timestamp?: number;
    author?: string;
  };
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  originalCardDimensions?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ExpandedCard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const ExpandedCard: React.FC<ExpandedCardProps> = ({ 
  item, 
  onClose,
  initialPosition = { x: 0, y: SCREEN_HEIGHT / 2 },
  originalCardDimensions
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const translateY = useSharedValue(initialPosition.y - SCREEN_HEIGHT / 2);
  const cardWidth = useSharedValue(SCREEN_WIDTH);
  const cardHeight = useSharedValue(SCREEN_HEIGHT);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    try {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    } catch (error) {
      console.error('Animation error:', error);
      onClose();
    }
  }, []);

  const safeClose = () => {
    'worklet';
    try {
      runOnJS(onClose)();
    } catch (error) {
      console.error('Safe close error:', error);
    }
  };

  const handleClose = () => {
    'worklet';
    try {
      if (originalCardDimensions) {
        opacity.value = withTiming(0.8, { duration: 300 });
        cardWidth.value = withTiming(originalCardDimensions.width);
        cardHeight.value = withTiming(originalCardDimensions.height);
        translateX.value = withTiming(originalCardDimensions.x);
        translateY.value = withTiming(
          originalCardDimensions.y - SCREEN_HEIGHT / 2, 
          { duration: 300 },
          () => safeClose()
        );
      } else {
        opacity.value = withTiming(0, 
          { duration: 300 },
          () => safeClose()
        );
      }
    } catch (error) {
      runOnJS(console.error)('Close animation error:', error);
      safeClose();
    }
  };

  const handleImageError = () => {
    Alert.alert(
      'Error',
      'Failed to load image. Please try again later.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    width: cardWidth.value,
    height: cardHeight.value,
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      try {
        const newTranslateY = Math.max(
          Math.min(event.translationY, SCREEN_HEIGHT * 0.3),
          -SCREEN_HEIGHT * 0.3
        );
        translateY.value = newTranslateY;
      } catch (error) {
        runOnJS(console.error)('Pan update error:', error);
      }
    })
    .onEnd((event) => {
      'worklet';
      try {
        const velocity = Math.abs(event.velocityY);
        const position = Math.abs(translateY.value);
        
        const clampedVelocity = Math.min(velocity, 2000);
        
        const shouldClose = 
          clampedVelocity > 800 || 
          position > SCREEN_HEIGHT * 0.2;

        if (shouldClose) {
          handleClose();
        } else {
          translateY.value = withSpring(0, { 
            damping: 15,
            stiffness: 100,
            mass: 1,
            velocity: event.velocityY
          });
        }
      } catch (error) {
        runOnJS(console.error)('Pan end error:', error);
        handleClose();
      }
    })
    .minDistance(10)
    .enabled(true);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <View style={styles.container}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.cardContainer, animatedStyle]}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.fullscreenImage} 
                resizeMode="cover"
                onError={handleImageError}
              />
              <View style={styles.overlay} />
              <Animated.View style={styles.contentOverlay}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {item.category || 'Uncategorized'}
                  </Text>
                </View>
                <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                <Text style={styles.description}>
                  {item.description || 'No description available'}
                </Text>
                {item.author && (
                  <Text style={styles.author}>By {item.author}</Text>
                )}
                {item.timestamp && (
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                )}
              </Animated.View>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => handleClose()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    maxHeight: SCREEN_HEIGHT,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timestamp: {
    fontSize: 12,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ExpandedCard;