import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Hamburger = ({ onPress, isDarkMode }) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.touchable}>
			<View style={styles.hamburgerContainer}>
				<View style={isDarkMode ? styles.darkTopLine : styles.lightTopLine} />
				<View style={isDarkMode ? styles.darkMiddleLine : styles.lightMiddleLine} />
				<View style={isDarkMode ? styles.darkLowerLine : styles.lightLowerLine} />
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
	darkTopLine: {
		width: 15,
		height: 2,
		backgroundColor: '#FFB67E'
	},
	darkMiddleLine: {
		width: 20,
		height: 2,
		backgroundColor: '#FFB67E'
	},
	darkLowerLine: {
		width: 7,
		height: 2,
		backgroundColor: '#FFB67E'
	},
	lightTopLine: {
		width: 15,
		height: 2,
		backgroundColor: '#EF7C00'
	},
	lightMiddleLine: {
		width: 20,
		height: 2,
		backgroundColor: '#EF7C00'
	},
	lightLowerLine: {
		width: 7,
		height: 2,
		backgroundColor: '#EF7C00'
	}
});
