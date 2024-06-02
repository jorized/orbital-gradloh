import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const Hamburger = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={styles.hamburgerContainer}>
        <View style={styles.topLine} />
        <View style={styles.middleLine} />
        <View style={styles.lowerLine} />
      </View>
    </TouchableOpacity>
  );
};

export default Hamburger;

const styles = StyleSheet.create({
  touchable: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginVertical: 20,
  },
  hamburgerContainer: {
    width: 30,
    height: 20,
    justifyContent: "space-between",
    alignItems: "left",
    marginLeft: -30,
    marginTop: -40,
  },
  topLine: {
    width: 15,
    height: 2,
    backgroundColor: "white",
  },
  middleLine: {
    width: 20,
    height: 2,
    backgroundColor: "white",
  },
  lowerLine: {
    width: 7,
    height: 2,
    backgroundColor: "white",
  },
});
