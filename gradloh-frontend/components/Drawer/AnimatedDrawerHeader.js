import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import ThemeContext from "../../contexts/ThemeContext";

export default function AnimatedDrawerHeader() {

    const theme = useContext(ThemeContext);
    const headerCardHeight = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => {
        return {
            height: headerCardHeight.value
        }
    })

    useFocusEffect(
        React.useCallback(() => {
            // Reset and animate the headerCardHeight
            headerCardHeight.value = 0;
            headerCardHeight.value = withTiming(240, { duration: 900 });
        }, [])
    );

    return (
        <Animated.View style={[styles.topLayout, headerStyle, { backgroundColor: theme.hamburgerColor }]}></Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topLayout: {
        width: "100%",
        height: 240,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
});
