import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Text } from 'react-native';
import Hamburger from '../components/Hamburger';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {
	useFonts,
	Quicksand_300Light,
	Quicksand_400Regular,
	Quicksand_500Medium,
	Quicksand_600SemiBold,
	Quicksand_700Bold,
  } from '@expo-google-fonts/quicksand';
import ThemeContext from '../theme/ThemeContext';

const DrawerHeader = ({
  navigation,
  isHomeScreen,
  toggleTheme,
  isDarkMode
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const buttonColorAnim = useRef(
    new Animated.Value(isDarkMode ? 1 : 0)
  ).current; // 1 for dark mode, 0 for light mode
  const [isDarkModeButtons, setIsDarkModeButtons] = useState(isDarkMode);

  const [fontsLoaded] = useFonts({
	Quicksand_700Bold
});

const theme = useContext(ThemeContext);

  useEffect(() => {
    // Update the animated value when isDarkMode changes
    Animated.timing(buttonColorAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [isDarkMode]);

  const handlePress = async () => {
    // Change the theme first
    toggleTheme();

    // Reset opacity and translateY to ensure animation starts from visible state
    opacity.setValue(1);
    translateY.setValue(0);

    // Start the fade-out and fade-in animation with upward movement
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(buttonColorAnim, {
          toValue: isDarkModeButtons ? 0 : 1, // Reverse the color
          duration: 300,
          useNativeDriver: false
        })
      ]),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ])
    ]).start(async () => {
      // Change the dark/light mode button style after the animation completes
      const isDarkModeSession = await SecureStore.getItemAsync(
        'isDarkMode'
      );
      const isDarkModeSessionFinal = JSON.parse(isDarkModeSession);
      setIsDarkModeButtons(!isDarkModeSessionFinal);
    });
  };

  const interpolatedButtonColor = buttonColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#EF7C00', '#FFB67E'] // Light to dark mode colors
  });

  if (!fontsLoaded) {
	return <Text>Loading...</Text>;
}

  return (
    <View style={styles.headerContainer}>
      <Hamburger
        onPress={() => navigation.openDrawer()}
        isDarkMode={isDarkMode}
      />
	  <Text style={[styles.titleText, {color : theme.color}]}>Dashboard</Text>
      {isHomeScreen && (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Animated.View
            style={[
              styles.button,
              { backgroundColor: interpolatedButtonColor }
            ]}
          >
            <Pressable onPress={handlePress}>
              <Ionicons
                name={
                  isDarkModeButtons ? 'moon' : 'sunny-outline'
                }
                size={24}
                color={isDarkModeButtons ? '#000000' : 'white'}
              />
            </Pressable>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingTop: 30,
    backgroundColor: 'transparent'
  },
  titleText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 26,
    fontFamily: "Quicksand_700Bold",
	marginLeft: -20,
  },
  button: {
    marginRight: 20,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default DrawerHeader;
