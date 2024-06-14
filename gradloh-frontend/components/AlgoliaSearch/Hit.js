import { StyleSheet, Text } from "react-native";
import { Highlight } from "./Highlight";
import { useContext } from "react";
import ThemeContext from "../../contexts/ThemeContext";

export default function Hit({ hit }) {

    const theme = useContext(ThemeContext);

    return (
        <Text>
          <Highlight hit={hit} attribute="moduleCode" highlightedStyle={[styles.highlighted]} nonHighlightedStyle={[styles.nonHighlighted, {color : theme.color}]}/>
        </Text>
      );

}


const styles = StyleSheet.create({
    highlighted: {
      fontWeight: 'bold',
      backgroundColor: '#CCDDED',
    },
    nonHighlighted: {
      fontWeight: 'normal',
      backgroundColor: 'transparent',
    },
  });