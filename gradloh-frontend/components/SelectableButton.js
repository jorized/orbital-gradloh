import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';

export default function SelectableButton({ isSelected, setIsSelected, label }) {
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(backgroundColorAnim, {
            toValue: isSelected ? 1 : 0,
            duration: 150,
            useNativeDriver: false, // Set to false for color interpolation
        }).start();
    }, [isSelected]);

    const backgroundColor = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#fff', '#000'], // Unselected to selected colors
    });

    const textColor = backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000', '#fff'], // Unselected to selected text colors
    });

    const handlePress = () => {
        setIsSelected(!isSelected);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePress} style={styles.pressable}>
                <Animated.View style={[styles.button, { backgroundColor }]}>
                    <Animated.Text style={[styles.buttonText, { color: textColor }]}>
                        {label}
                    </Animated.Text>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        alignItems: 'center',
    },
    pressable: {
        width: "100%",
        borderRadius: 25,
        overflow: 'hidden',
    },
    button: {
        padding: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});
