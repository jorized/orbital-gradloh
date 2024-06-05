import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDoneButton = ({
	title,
	backgroundColor,
	fadeInDuration = 500,
	...props
}) => {
	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: fadeInDuration, // Duration of the fade-in animation
			useNativeDriver: true
		}).start();
	}, [fadeAnim, fadeInDuration]);

	return (
		<Animated.View style={{ opacity: fadeAnim }}>
			<TouchableOpacity
				style={[styles.button, { backgroundColor }]}
				{...props}
			>
				<Text style={styles.buttonText}>{title}</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
		marginHorizontal: 10
	},
	buttonText: {
		color: '#EF7C00',
		fontSize: 16
	}
});

export default CustomDoneButton;
