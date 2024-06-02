import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

import Ionicons from "react-native-vector-icons/Ionicons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 150;

const BottomSheet = () => {
  const translateY = useSharedValue(10);

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y - 100);
    })
    .onEnd((event) => {
      const position = context.value.y - event.translationY;
      position > context.value.y
        ? (translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 }))
        : (translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 }));
    });

  useEffect(() => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 100, MAX_TRANSLATE_Y],
      [75, 50],
      Extrapolation.CLAMP
    );
    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <LinearGradient
          colors={["#AF5030", "#7f3800"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
        />

        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <View style={styles.wordsContainer}>
          <View>
            <Text style={styles.mainLeftWords}>
              Progression Status: on-track
            </Text>
            <Text style={styles.subLeftWords}>
              No. of core mods taken: 0 / 15
            </Text>
            <Text style={styles.subLeftWords}>
              No. of electives taken: 0 / 19
            </Text>
            <Text style={styles.subLeftWords}>No. of GEs taken: 0 / 6 </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.button1}>
              <Ionicons
                name="add-circle"
                backgroundColor="transparant"
                size={40}
                color="white"
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
              <Ionicons
                name="add-circle"
                backgroundColor="transparant"
                size={40}
                color="white"
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button3}>
              <Ionicons
                name="add-circle"
                backgroundColor="transparant"
                size={40}
                color="white"
              ></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button4}>
              <Ionicons
                name="add-circle"
                backgroundColor="transparant"
                size={40}
                color="white"
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "90%",
    left: SCREEN_WIDTH * 0.05, // Centers the bottom sheet horizontally
    position: "absolute",
    top: SCREEN_HEIGHT,
    overflow: "hidden",
  },
  lineContainer: {
    justifyContent: "center",
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "#055358",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 20,
  },
  wordsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginTop: 20,
  },
  mainLeftWords: {
    color: "#FFFFFF",
    fontSize: 20,
    marginTop: 10,
  },
  subLeftWords: {
    color: "black",
    fontSize: 20,
    marginTop: 40,
  },
  rightWordsContainer: {
    //marginTop: 20,
  },
  mainRightWords: {
    fontSize: 20,
    color: "#FFFFFF",
    marginRight: 20,
    fontWeight: "condensedBold",
  },
  button1: {
    width: 40,
    height: 40,
    marginRight: 40,
    marginTop: 5,
  },
  button2: {
    width: 40,
    height: 40,
    marginRight: 40,
    marginTop: 20,
  },
  button3: {
    width: 40,
    height: 40,
    marginRight: 40,
    marginTop: 20,
  },
  button4: {
    width: 40,
    height: 40,
    marginRight: 40,
    marginTop: 20,
  },
});
