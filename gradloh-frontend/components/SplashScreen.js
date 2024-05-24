// SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ onAnimationFinish }) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      onAnimationFinish();
    }, 3000); // Adjust the duration based on your animation

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>

        <LottieView
            source={require('../assets/images/SplashScreen.json')}
            autoPlay
            loop={false}
            onAnimationFinish={onAnimationFinish}
            style={styles.lottie}
        />
        <LottieView
            source={require('../assets/images/SplashLoading.json')}
            autoPlay
            loop={true}
            onAnimationFinish={onAnimationFinish}
            style={styles.lottietwo}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust the background color as needed
  },
  lottie: {
    width: Dimensions.get('window').width * 0.9, // Adjust the size as needed
    height: Dimensions.get('window').width * 0.9, // Adjust the size as needed
  },
  lottietwo: {
    width: Dimensions.get('window').width * 0.05, // Adjust the size as needed
    height: Dimensions.get('window').width * 0.05, // Adjust the size as needed
  },
});

export default SplashScreen;