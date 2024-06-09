// components/CustomDrawerContent.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItemList
} from '@react-navigation/drawer';
import { AuthContext } from '../contexts/AuthContext';

const LogoutDrawerContent = (props) => {
	const authContext = useContext(AuthContext);
	const { userNickname } = props;

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
		<DrawerContentScrollView {...props}>
			<View style={styles.userInfoSection}>
				<Text style={styles.userNickname}>{userNickname}</Text>
			</View>
			<DrawerItemList {...props} />
			<View style={styles.logoutContainer}>
				<Button title="Logout" onPress={handleLogout} color="#ff6347" />
			</View>
		</DrawerContentScrollView>
	);
};

const styles = StyleSheet.create({
	userInfoSection: {
		padding: 20,
		backgroundColor: '#f4f4f4',
		marginBottom: 10
	},
	userNickname: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	logoutContainer: {
		margin: 20
	}
});

export default LogoutDrawerContent;
