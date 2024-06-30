import React, { useEffect, forwardRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Pressable,
	TouchableOpacity,
	Button
} from 'react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_300Light,
	Lexend_400Regular,
	Lexend_600SemiBold
} from '@expo-google-fonts/lexend';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function LandingScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { showToast = false, toastMessage = '' } = route.params || {};

	const [fontsLoaded] = useFonts({
		Lexend_300Light,
		Lexend_400Regular,
		Lexend_600SemiBold
	});


	useEffect(() => {

		//fetchDataAndUploadToAlgolia();
		if (showToast) {
			Toast.show({
				type: 'success',
				text1: 'Success',
				text2: toastMessage,
				visibilityTime: 5000,
				autoHide: true,
				position: 'bottom',
				bottomOffset: 40
			});
		}
	}, [showToast, toastMessage]);

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					style={styles.landingImg}
					source={require('../../assets/images/GradLohLanding.png')}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<Pressable
					style={styles.registerPressable}
					onPress={() => navigation.push('RegisterScreen')}
				>
					<Image
						style={styles.emailIcon}
						source={require('../../assets/images/emailicon.png')}
					/>
					<Text style={styles.registerText}>Sign up with email</Text>
				</Pressable>
				<Pressable
					style={styles.loginPressable}
					onPress={() => navigation.push('LoginScreen')}
				>
					<Text style={styles.loginText}>Sign in</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'space-between'
	},
	imageContainer: {
		marginTop: 200,
		alignItems: 'center'
	},
	buttonContainer: {
		padding: 36,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: "#EF7C00"
	},
	landingImg: {
		width: 250,
		height: 250,
		resizeMode: 'contain'
	},
	loginPressable: {
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 12
	},
	loginText: {
		textAlign: 'center',
		color: 'black',
		fontSize: 18,
		fontFamily: 'Lexend_400Regular'
	},
	registerPressable: {
		padding: 16,
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		marginBottom: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	emailIcon: {
		width: 20,
		height: 20,
		resizeMode: 'contain',
		marginRight: 10
	},
	registerText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 18,
		fontFamily: 'Lexend_400Regular'
	},
});
