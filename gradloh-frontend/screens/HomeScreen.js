import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Button
} from 'react-native';
import ThemeContext from '../theme/ThemeContext';
import CustomBottomSheet from '../components/CustomBottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import ProgressChart from '../components/ProgressChart';
import { BACKDROP_COLOR, GRADIENT_COLORS } from '../assets/misc/colors';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HEIGHT, OVERDRAG } from '../assets/misc/consts';
import AccentPicker from '../components/AccentPicker';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const theme = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_COLORS[0]);

  const offset = useSharedValue(0);

  useEffect(() => {
    const loadSelectedGradient = async () => {
      try {
        const storedGradient = await SecureStore.getItemAsync('selectedGradient');
        if (storedGradient) {
          setSelectedGradient(JSON.parse(storedGradient));
        }
      } catch (error) {
        console.error('Failed to load the selected gradient color', error);
      }
    };
    loadSelectedGradient();
  }, []);

  const saveSelectedGradient = async (gradient) => {
    try {
      await SecureStore.setItemAsync('selectedGradient', JSON.stringify(gradient));
    } catch (error) {
      console.error('Failed to save the selected gradient color', error);
    }
  };

  const handlePick = (colorIndex) => {
    const selectedGradient = GRADIENT_COLORS[colorIndex];
    setSelectedGradient(selectedGradient);
    saveSelectedGradient(selectedGradient);
    toggleSheet();
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const toggleSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-OVERDRAG, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      return () => setIsVisible(false);
    }, [])
  );


  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaProvider>
        <ProgressChart toggleSheet={toggleSheet} accent={selectedGradient} />
        <View style={styles.bottomSheetContainer}>
          <CustomBottomSheet isVisible={isVisible} />
        </View>
        {isOpen && (
          <>
            <AnimatedPressable entering={FadeIn} exiting={FadeOut} style={styles.backdrop} onPress={toggleSheet} pointerEvents="auto"/>
            <GestureDetector gesture={pan}>
              <Animated.View style={[styles.sheet, translateY, { backgroundColor: theme.gradientColorBottomSheet }]}
                entering={SlideInDown.springify().damping(15)}
                exiting={SlideOutDown}
              >
                <AccentPicker onPick={handlePick} selectedGradient={selectedGradient} />
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: '40%',
  },
  sheet: {
    padding: 16,
    height: HEIGHT,
    width: "100%",
    position: "absolute",
    bottom: -OVERDRAG * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1,
  },
});
