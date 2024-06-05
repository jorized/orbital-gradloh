import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomNextButton = ({ nextLabel, backgroundColor, ...props }) => (
	<TouchableOpacity style={[styles.button, { backgroundColor }]} {...props}>
		<Text style={styles.buttonText}>{nextLabel}</Text>
	</TouchableOpacity>
);

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

export default CustomNextButton;
