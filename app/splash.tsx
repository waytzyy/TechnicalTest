// import { View, StyleSheet, Image } from 'react-native';
// import { Redirect } from 'expo-router';
// import Animated, { 
//   useAnimatedStyle, 
//   withTiming, 
//   useSharedValue, 
//   withSequence,
//   runOnJS
// } from 'react-native-reanimated';
// import { useEffect } from 'react';

// export default function SplashScreen() {
//   const opacity = useSharedValue(0);
//   const scale = useSharedValue(0.8);

//   const animatedStyles = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ scale: scale.value }],
//   }));

//   useEffect(() => {
//     opacity.value = withSequence(
//       withTiming(1, { duration: 1000 }),
//       withTiming(1, { duration: 1000 }),
//       withTiming(0, { duration: 1000 })
//     );
    
//     scale.value = withSequence(
//       withTiming(1, { duration: 1000 }),
//       withTiming(1, { duration: 1000 }),
//       withTiming(0.8, { duration: 1000 })
//     );
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.logoContainer, animatedStyles]}>
//         <Image 
//           source={require('../assets/images/splash.png')} 
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </Animated.View>
//       <Redirect href="/" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', // Sesuaikan dengan warna yang diinginkan
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoContainer: {
//     width: 200,
//     height: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: '100%',
//     height: '100%',
//   },
// });