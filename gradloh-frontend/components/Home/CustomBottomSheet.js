import React, { useEffect, useContext, useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SCREEN_HEIGHT, LOGIN_VIEW_HEIGHT } from "../../misc/consts";
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
      }

    }).catch(error => {
      console.log(error);
    })
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
        }

      }).catch(error => {
        console.log(error);
      })
    }, [email, publicAxios])
  );

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
    <View
      style={[
        {
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: SCREEN_HEIGHT - LOGIN_VIEW_HEIGHT }],
        },
      ]}
    >
      <View
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
        ]}
      >
        <View style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: theme.color }]}>
              Details
            </Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: theme.color }]}>Status : {status}</Text>
              {status === "On Track" ? <AntDesign name="checkcircleo" size={24} color="#00D26A" /> : <AntDesign name="exclamationcircleo" size={24} color="#FCA90C" />}
            </View>
          </View>
          <ScrollView style={styles.contentContainer}>
            <BottomSheetCard
              iconName="pushpino"
              title="Core modules"
              marks={completedCoreMods}
              percentage={corePercentage} />
            <BottomSheetCard
              iconName="pushpino"
              title={ccOrCHSTitle}
              marks={completedCCOrCHSMods}
              percentage={chsPercentage} />
            <BottomSheetCard
              iconName="pushpino"
              title="UE"
              marks={"Completed 5 / 6"}
              percentage={62} />
          </ScrollView>
        </View>
      </View>
    </View>
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
