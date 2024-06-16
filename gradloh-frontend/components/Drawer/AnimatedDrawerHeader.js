import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function AnimatedDrawerHeader() {
    const headerCardHeight = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => {
        return {
            height: headerCardHeight.value
        }
    })

    useEffect(() => {
        headerCardHeight.value = withTiming(240, {duration : 900})
    }, [])

    return (
        <Animated.View style = {[styles.topLayout, headerStyle]}></Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    topLayout: {
        width: "100%",
        height: 240,
        backgroundColor : "#EF7C00",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },

  });