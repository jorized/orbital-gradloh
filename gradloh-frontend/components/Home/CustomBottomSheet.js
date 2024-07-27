import React, { useEffect, useContext, useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { SCREEN_HEIGHT, LOGIN_VIEW_HEIGHT } from "../../misc/consts";
import ThemeContext from "../../contexts/ThemeContext";
import { AntDesign } from '@expo/vector-icons';
import BottomSheetCard from "./BottomSheetCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Lexend_300Light, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { AxiosContext } from "../../contexts/AxiosContext";
import * as SecureStore from 'expo-secure-store';

export default function CustomBottomSheet() {
  const navigation = useNavigation();
  const [status, setStatus] = useState("");
  const [ccOrCHSTitle, setCCOrCHSTitle] = useState("");
  const [completedCoreMods, setCompletedCoreMods] = useState("");
  const [corePercentage, setCorePercentage] = useState(0);
  const [completedCCOrCHSMods, setCompletedCCOrCHSMods] = useState("");
  const [chsPercentage, setCHSPercentage] = useState(0);
  const [completedUEMods, setCompletedUEMods] = useState("");
  const [uePercentage, setUEPercentage] = useState(0);

  const publicAxios = useContext(AxiosContext);
  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = userProfileDetails ? JSON.parse(userProfileDetails).email : null;
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (email) {
      publicAxios.authAxios.get('/userprogressdetails', {
        params: { email: email }
      }).then(response => {
        const data = response.data;
        setStatus(data.progressionStatus);
        if (data.homeFaculty === "CHS") {
          setCompletedCoreMods(`Completed ${data.completedCoreModules.totalModulesCompleted} / ${data.completedCoreModules.totalModulesRequired}`);
          const completedCorePercentage = Math.round((data.completedCoreModules.totalModulesCompleted / data.completedCoreModules.totalModulesRequired) * 100);
          setCorePercentage(completedCorePercentage > 100 ? 100 : completedCorePercentage);

          
          setCCOrCHSTitle("CHS modules");
          setCompletedCCOrCHSMods(`Completed ${data.completedCHSModules} / 13`);
          const completedCHSPercentage = Math.round((data.completedCHSModules / 13) * 100);
          setCHSPercentage(completedCHSPercentage > 100 ? 100 : completedCHSPercentage);

          setCompletedUEMods(`Completed ${data.completedUEModules} / 13`);
          const completedUEPercentage = Math.round((data.completedUEModules / 13) * 100);
          setUEPercentage(completedUEPercentage > 100 ? 100 : completedUEPercentage);
          
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      if (email) {
        publicAxios.authAxios.get('/userprogressdetails', {
          params: { email: email }
        }).then(response => {
          const data = response.data;
          setStatus(data.progressionStatus);
          if (data.homeFaculty === "CHS") {
            setCompletedCoreMods(`Completed ${data.completedCoreModules.totalModulesCompleted} / ${data.completedCoreModules.totalModulesRequired}`);
            const completedCorePercentage = Math.round((data.completedCoreModules.totalModulesCompleted / data.completedCoreModules.totalModulesRequired) * 100);
            setCorePercentage(completedCorePercentage > 100 ? 100 : completedCorePercentage);
            const completedCHSPercentage = Math.round((data.completedCHSModules / 13) * 100);
            setCCOrCHSTitle("CHS modules");
            setCompletedCCOrCHSMods(`Completed ${data.completedCHSModules} / 13`);
            setCHSPercentage(completedCHSPercentage > 100 ? 100 : completedCHSPercentage);
          }
        }).catch(error => {
          console.log(error);
        });
      }
    }, [email, publicAxios])
  );

  const [fontsLoaded] = useFonts({
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Lexend_600SemiBold,
    Lexend_300Light,
    Lexend_700Bold
  });

  const handleHenryNavigation = () => {
    navigation.navigate("HenryStack", {
      screen: 'ChatbotScreen',
      params: { headerName: "Henry" }
    });
  }

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!email) {
    return <Text>Error loading user details.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.bottomSheetBgColor}]}>
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
              iconName="chart-bar"
              title="Core modules"
              marks={completedCoreMods}
              percentage={corePercentage} />
            <BottomSheetCard
              iconName="file-document-outline"
              title={ccOrCHSTitle}
              marks={completedCCOrCHSMods}
              percentage={chsPercentage} />
            <BottomSheetCard
              iconName="pillar"
              title="Unrestricted electives"
              marks={completedUEMods}
              percentage={uePercentage} />
          </ScrollView>
        </View>
      </View>

      {/* Icon Behind the Bottom Sheet */}
      <TouchableOpacity onPress={handleHenryNavigation}>
        <Image
          source={require('../../assets/images/henryicon.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bottomSheet: {
    width: '100%',
    height: LOGIN_VIEW_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2, // Ensure the bottom sheet is on top
  },
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
    fontFamily: "Lexend_400Regular",
  },
  statusContainer: {
    flexDirection: "row"
  },
  statusText: {
    fontSize: 20,
    fontFamily: "Lexend_400Regular",
    marginRight: 10
  },
  icon: {
    position: 'absolute',
    bottom: LOGIN_VIEW_HEIGHT - 20, // Adjust the icon position here
    left: 120,
    width: 60,
    height: 60,
    zIndex: 1, // Ensure the icon is behind the bottom sheet
  },
});
