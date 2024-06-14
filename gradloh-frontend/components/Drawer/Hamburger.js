import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ThemeContext from '../../contexts/ThemeContext';

const Hamburger = ({ onPress, isDarkMode }) => {
	const theme = useContext(ThemeContext);
	return (
		<TouchableOpacity onPress={onPress} style={styles.touchable}>
			<View style={styles.hamburgerContainer}>
				<View style={[styles.topLine, {backgroundColor: theme.hamburgerColor}]} />
				<View style={[styles.middleLine, {backgroundColor: theme.hamburgerColor}]} />
				<View style={[styles.lowerLine, {backgroundColor: theme.hamburgerColor}]} />
			</View>
		</TouchableOpacity>
	);
};

export default Hamburger;

const styles = StyleSheet.create({
	touchable: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 30,
		marginVertical: 20
	},
	hamburgerContainer: {
		width: 30,
		height: 20,
		justifyContent: 'space-between',
		alignItems: 'left',
		marginLeft: -40,

	},
	topLine: {
		width: 15,
		height: 2,
	},
	middleLine: {
		width: 20,
		height: 2,
	},
	lowerLine: {
		width: 7,
		height: 2,
	},
});
