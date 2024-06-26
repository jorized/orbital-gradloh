// Card.js
import React, { useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../../contexts/ThemeContext";
import { useFonts } from "expo-font";
import { Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CircularProgress from "react-native-circular-progress-indicator";

const BottomSheetCard = ({ iconName, title, marks, percentage }) => {

  const theme = useContext(ThemeContext);

  const [fontsLoaded] = useFonts({
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Lexend_600SemiBold,
    Lexend_300Light,
    Lexend_700Bold,
    Lexend_400Regular
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }


  return (
    <View style={[styles.card   ]}>
      
      <View style={styles.cardContent}>
        <View style = {[styles.iconContainer, {backgroundColor: theme.hamburgerColor}]}>
          <MaterialCommunityIcons name={iconName} size={30} color={theme.reverseColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, {color : theme.color}]}>{title}</Text>
          <Text style={styles.cardMarks}>{marks}</Text>
        </View>
        <CircularProgress
          radius = {30}
          value = {percentage}
          maxValue = {100}
          activeStrokeColor = {theme.hamburgerColor}
          inActiveStrokeColor="lightgray"
          valueSuffix = "%"
          progressValueColor={theme.color}
          progressValueFontSize={10}
          activeStrokeWidth={6}
          inActiveStrokeWidth={6}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,

  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lexend_400Regular",
  },
  cardMarks: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "Lexend_300Light"
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 18,
    marginRight: 10,
    fontFamily: "Lexend_600SemiBold"
  },
  iconContainer: {
    padding: 10,
    borderRadius: 8,
  }
});

export default BottomSheetCard;
