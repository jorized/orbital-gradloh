import React, { useRef, useEffect, useContext, useCallback, useState } from "react";
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
import { AxiosContext } from "../../contexts/AxiosContext";
import * as SecureStore from 'expo-secure-store';

export default function CustomBottomSheet() {

  const [status, setStatus] = useState("");

  const [ccOrCHSTitle, setCCOrCHSTitle] = useState("");

  const [completedCoreMods, setCompletedCoreMods] = useState("");
  const [corePercentage, setCorePercentage] = useState(0);

  const [completedCCOrCHSMods, setCompletedCCOrCHSMods] = useState("");
  const [chsPercentage, setCHSPercentage] = useState(0);



  const publicAxios = useContext(AxiosContext);
  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;
  const theme = useContext(ThemeContext);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    publicAxios.authAxios.get('/userprogressdetails', {
      params: { email: email }
    }).then(response => {
      const data = response.data;
      setStatus(data.progressionStatus);
      //If CHS Student
      if (data.homeFaculty === "CHS") {
        setCompletedCoreMods("Completed " + data.completedCoreModules.totalModulesCompleted + " / " + data.completedCoreModules.totalModulesRequired);
        const completedCorePercentage = Math.round((data.completedCoreModules.totalModulesCompleted / data.completedCoreModules.totalModulesRequired) * 100);
        if (completedCorePercentage > 100) {
          setCorePercentage(100);
        } else {
          setCorePercentage(completedCorePercentage);
        }
        const completedCHSPercentage = Math.round((data.completedCHSModules / 13) * 100);
        setCCOrCHSTitle("CHS modules")
        setCompletedCCOrCHSMods("Completed " + data.completedCHSModules + " / 13");
        if (completedCHSPercentage > 100) {
          setCHSPercentage(100);
        } else {
          setCHSPercentage(completedCHSPercentage);
        }
      } else {

      }

    }).catch(error => {
      console.log(error);
    })

    scale.value = withTiming(1, { duration: 0 });
    translateY.value = withTiming(SCREEN_HEIGHT - LOGIN_VIEW_HEIGHT, {
      duration: 500,
    });

    // Cleanup function to reset values when unfocused
    return () => {
      scale.value = 0;
      translateY.value = SCREEN_HEIGHT;
    };
  }, [])

  useFocusEffect(
    useCallback(() => {
      publicAxios.authAxios.get('/userprogressdetails', {
        params: { email: email }
      }).then(response => {
        const data = response.data;
        setStatus(data.progressionStatus);
        //If CHS Student
        if (data.homeFaculty === "CHS") {
          setCompletedCoreMods("Completed " + data.completedCoreModules.totalModulesCompleted + " / " + data.completedCoreModules.totalModulesRequired);
          const completedCorePercentage = Math.round((data.completedCoreModules.totalModulesCompleted / data.completedCoreModules.totalModulesRequired) * 100);
          if (completedCorePercentage > 100) {
            setCorePercentage(100);
          } else {
            setCorePercentage(completedCorePercentage);
          }
          const completedCHSPercentage = Math.round((data.completedCHSModules / 13) * 100);
          setCCOrCHSTitle("CHS modules")
          setCompletedCCOrCHSMods("Completed " + data.completedCHSModules + " / 13");
          if (completedCHSPercentage > 100) {
            setCHSPercentage(100);
          } else {
            setCHSPercentage(completedCHSPercentage);
          }
        } else {

        }

      }).catch(error => {
        console.log(error);
      })

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
          <View style = {styles.statusContainer}>
            <Text style = {[styles.statusText, {color : theme.color}]}>Status : {status}</Text>
            {status === "On Track" ? <AntDesign name="checkcircleo" size={24} color="#00D26A" /> :  <AntDesign name="exclamationcircleo" size={24} color="#FCA90C" />}
          </View>
        </View>
        <ScrollView style = {styles.contentContainer}>
          <BottomSheetCard
            iconName="pushpino" // Replace with the desired icon name
            title="Core modules"
            marks={completedCoreMods}
            percentage={corePercentage}/>
                    <BottomSheetCard
            iconName="pushpino" // Replace with the desired icon name
            title={ccOrCHSTitle}
            marks={completedCCOrCHSMods}
            percentage={chsPercentage}/>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  titleText: {
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
  },

  statusContainer: {
    flexDirection: "row"
  },

  statusText: {
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
    marginRight: 10
  }
  


});