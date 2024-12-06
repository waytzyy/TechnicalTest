# Welcome to your Expo Card Carousel App 👋

This is an [Expo](https://expo.dev) project featuring an animated card carousel implementation.

## Features

### Core Components

Card Component

- Basic card display with image and content
- Horizontal scrollable list
- Modal expansion on tap
CarouselView Component

- Animated carousel with scaling effects
- Rating display with stars
- Category badges
- Gradient overlays

ExpandedCard Component

- Full-screen detailed view
- Gesture-based interactions
- Smooth transitions

### Key Features

- Smooth animations with interpolation
- Gesture handling with Pan gestures
- Error boundaries for crash prevention
- Responsive design with screen dimensions
- Image loading error handling
- Custom styling with StyleSheet

### Implementation Highlights

#### Animations

- Scale transitions
- Opacity changes
- Position animations

#### Performance

- Gesture worklets
- Shared values
- Error boundaries

#### UX Features

- Intuitive gestures
- Visual feedback
- Error handling

### Common Issues & Solutions

1. Performance: Used worklets for smooth animations
2. Memory: Proper cleanup in useEffect
3. Errors: Implemented error boundaries

### Future Improvements

1. Virtual list rendering
2. Image caching
3. Accessibility support

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Development Options

You can run the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
