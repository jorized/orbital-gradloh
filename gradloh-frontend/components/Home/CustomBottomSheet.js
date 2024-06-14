import React, { useRef, useEffect, useContext, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { SCREEN_HEIGHT, LOGIN_VIEW_HEIGHT, BOTTOM_SHEET_MARGIN } from "../../misc/consts";
import ThemeContext from "../../contexts/ThemeContext";
import { AntDesign } from '@expo/vector-icons';
import BottomSheetCard from "./BottomSheetCard";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Lexend_300Light, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";

export default function CustomBottomSheet() {
  const theme = useContext(ThemeContext);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useFocusEffect(
    useCallback(() => {
      scale.value = withTiming(1, { duration: 0 });
      translateY.value = withTiming(SCREEN_HEIGHT - LOGIN_VIEW_HEIGHT, {
        duration: 500,
      });

      // Cleanup function to reset values when unfocused
      return () => {
        scale.value = 0;
        translateY.value = SCREEN_HEIGHT;
      };
    }, [scale, translateY])
  );



  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const innerLoginYStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scale.value, [0, 1], [LOGIN_VIEW_HEIGHT, 0]),
      },
    ],
  }));

  const [fontsLoaded] = useFonts({
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Lexend_600SemiBold,
    Lexend_300Light,
    Lexend_700Bold
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (

    <Animated.View
    style={[
      {
        ...StyleSheet.absoluteFill,
      },
      translateYStyle,
    ]}
  >
    <Animated.View
      style={[
        {
          height: LOGIN_VIEW_HEIGHT,
          backgroundColor: theme.bottomSheetBgColor,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          
          elevation: 5,
        },
        innerLoginYStyle,
      ]}
    >
      <View style = {styles.cardContainer} >
        <View style = {styles.titleContainer}>
          <Text style = {[styles.titleText, {color: theme.color}]}>
            Details
          </Text>
        </View>
        <ScrollView style = {styles.contentContainer}>
          <BottomSheetCard
            iconName="pushpino" // Replace with the desired icon name
            title="Core"
            marks={"Completed 5 / 6"}
            percentage={62}/>
                    <BottomSheetCard
            iconName="pushpino" // Replace with the desired icon name
            title="CC"
            marks={"Completed 5 / 6"}
            percentage={62}/>
                    <BottomSheetCard
            iconName="pushpino" // Replace with the desired icon name
            title="UE"
            marks={"Completed 5 / 6"}
            percentage={62}/>
        </ScrollView>

      </View>
    </Animated.View>
  </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },

  titleContainer: {
    padding: 20,
  },

  titleText: {
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
  },
  


});