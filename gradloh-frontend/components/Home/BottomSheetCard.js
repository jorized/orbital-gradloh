// Card.js
import React, { useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../../contexts/ThemeContext";
import { useFonts } from "expo-font";
import { Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { Lexend_300Light, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";

const BottomSheetCard = ({ iconName, title, marks, percentage }) => {

  const theme = useContext(ThemeContext);

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
    <View style={[styles.card   ]}>
      
      <View style={styles.cardContent}>
        <AntDesign name={iconName} size={30} color={theme.color} />
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, {color : theme.color}]}>{title}</Text>
          <Text style={styles.cardMarks}>{marks}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.percentageText, {color : theme.color}]}>{percentage}%</Text>
          <AntDesign name="right" size={24} color={theme.color} />
        </View>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lexend_700Bold",
  },
  cardMarks: {
    fontSize: 16,
    color: "#757575",
    fontFamily: "Lexend_600SemiBold,"
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
});

export default BottomSheetCard;
