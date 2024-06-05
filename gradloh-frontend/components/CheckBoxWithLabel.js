import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CheckBoxWithLabel = ({
	label,
	value,
	onValueChange,
	error,
	errorMessage
}) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => onValueChange(!value)}
				style={styles.checkboxContainer}
			>
				<Checkbox
					value={value}
					onValueChange={onValueChange}
					color={value ? '#EF7C00' : error ? '#D00E17' : undefined}
					style={styles.checkbox}
				/>
				<Text style={[styles.label, error && styles.errorLabel]}>
					{label}
				</Text>
			</TouchableOpacity>
			{error && (
				<View style={styles.errorContainer}>
					<Icon
						name="error"
						size={16}
						color="#D00E17"
						style={styles.errorIcon}
					/>
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24 // To create space between the checkbox and the button
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	checkbox: {
		marginRight: 8
	},
	label: {
		fontSize: 16,
		color: '#000'
	},
	errorLabel: {
		color: '#D00E17'
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5
	},
	errorIcon: {
		marginRight: 5
	},
	errorMessage: {
		color: '#D00E17',
		fontSize: 12
	}
});

export default CheckBoxWithLabel;
