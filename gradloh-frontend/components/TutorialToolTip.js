import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ThemeContext from '../contexts/ThemeContext';

const TutorialToolTip = ({ title, text, buttonText, onPress }) => {

    const theme = useContext(ThemeContext);

    return (
        <View style={styles.tooltipContainer}>
            <View style={styles.tooltipContent}>
                <Text style={[styles.title, {color : theme.hamburgerColor}]}>{title}</Text>
                <Text style={[styles.text, {color : theme.color}]}>{text}</Text>
                <TouchableOpacity style={[styles.button, {backgroundColor: theme.hamburgerColor}]} onPress={onPress}>
                    <Text style={[styles.buttonText, {color : theme.reverseColor}]}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tooltipArrow} />
        </View>
    );
};

const styles = StyleSheet.create({
    tooltipContainer: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        borderRadius: 4,
        paddingVertical: 8,
        alignSelf: 'flex-end',  // Align button to the right
        padding: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        marginLeft: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
    },
});

export default TutorialToolTip;
