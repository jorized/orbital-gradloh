import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PRIMARY_COLOR, GRADIENT_COLORS } from "../assets/misc/colors";
import { HEIGHT } from "../assets/misc/consts";
import { Svg, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import ThemeContext from "../theme/ThemeContext";

const { width: windowWidth } = Dimensions.get("window");
const gap = 10;

function AccentPicker({ onPick, selectedGradient }) {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text style={[styles.label, { color: theme.color }]}>Change gradient</Text>
      <View style={styles.container}>
        {GRADIENT_COLORS.map((gradient, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.swatch,
              selectedGradient[0] === gradient[0] && selectedGradient[1] === gradient[1] && {borderColor: theme.color},
            ]}
            onPress={() => onPick(index)}
          >
            <Svg height="100%" width="100%">
              <Defs>
                <LinearGradient id={`grad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={gradient[0]} stopOpacity="1" />
                  <Stop offset="100%" stopColor={gradient[1]} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={`url(#grad${index})`}
              />
            </Svg>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap,
    flex: 1,
    height: HEIGHT / 2,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: PRIMARY_COLOR,
  },
  swatch: {
    height: (windowWidth - 10 * gap) / 7,
    aspectRatio: 1,
    borderRadius: 4,
    overflow: 'hidden', // Ensures gradient doesn't overflow the swatch
    borderWidth: 2,
    borderColor: 'transparent', // Default border color for non-selected swatches
  },
  selectedSwatch: {
    borderColor: 'black', // Border color for the selected swatch
  },
});

export default AccentPicker;
