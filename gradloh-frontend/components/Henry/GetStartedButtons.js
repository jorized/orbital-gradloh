import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ThemeContext from '../../contexts/ThemeContext';

const GetStartedButtons = ({ text, onButtonPress, textCenter }) => {
    const theme = useContext(ThemeContext);
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.hamburgerColor }]}
            onPress={onButtonPress}
        >
            <Text style={textCenter ? styles.buttonTextCenter : styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '85%',  
        alignItems: 'center',
        marginVertical: 5
    },
    buttonTextCenter: {
        color: 'white',
        fontSize: 16,
        textAlign: "center"
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});

export default GetStartedButtons;
