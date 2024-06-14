// components/CustomDrawerContent.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList
} from '@react-navigation/drawer';
import { AuthContext } from '../../contexts/AuthContext';
import ThemeContext from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const LogoutDrawerContent = (props) => {
	const authContext = useContext(AuthContext);
	const { userNickname, navigation } = props;
	const theme = useContext(ThemeContext);

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Logout Cancelled'),
				style: 'cancel'
			},
			{
				text: 'Yes',
				onPress: () => {
					authContext.logout(); //Logout
				}
			}
		]);
	};

	return (
		<DrawerContentScrollView {...props} style={{backgroundColor: theme.backgroundColor}} contentContainerStyle={{ flex: 1 }}>
			<View style={[styles.userInfoSection, {backgroundColor: theme.hamburgerColor}]}>
				<Text style={[styles.userNickname, {color : theme.reverseColor}]}>{userNickname}</Text>
			</View>
			<View style={styles.drawerContent}>
				<DrawerItemList {...props} />
			</View>
			<View style={styles.logoutContainer}>
				<Button title="Logout" onPress={handleLogout} color="#ff6347" />
			</View>
		</DrawerContentScrollView>
	);
};

const styles = StyleSheet.create({
	userInfoSection: {
		padding: 20,
		marginBottom: 10
	},
	userNickname: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	logoutContainer: {
		margin: 20,
	},
	drawerContent: {
		flex: 1,
	}
});

export default LogoutDrawerContent;
