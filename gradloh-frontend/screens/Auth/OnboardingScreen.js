import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useContext } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_300Light,
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import CustomDoneButton from '../../components/Auth/CustomDoneButton';
import CustomNextButton from '../../components/Auth/CustomNextButton';
import { AxiosContext } from '../../contexts/AxiosContext';

export default function OnboardingScreen() {
	const route = useRoute();
	const { nickname, email, accessToken, refreshToken } = route.params || {};

	const authContext = useContext(AuthContext);
	const publicAxios = useContext(AxiosContext);

	const [fontsLoaded] = useFonts({
		Lexend_300Light,
		Lexend_400Regular,
		Lexend_600SemiBold,
		Lexend_700Bold
	});

	const handleSubmit = async () => {
		SecureStore.setItemAsync(
			'token',
			JSON.stringify({ accessToken, refreshToken })
		).then(() => {
			return SecureStore.setItemAsync(
				'userprofiledetails',
				JSON.stringify({
					nickname,
					email
				})
			);
		})
			.then(() => {
				return publicAxios.authAxios.post('/updateonboarding', { email });
			})
			.then(() => {
				// Step 4: Update auth state with authenticated property
				authContext.setAuthState({
					accessToken,
					refreshToken,
					authenticated: true,
					firstTimeUser: true
				});

			})
			.catch((e) => {
				console.error('Error during the process:', e);
			});
	};

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}
	return (
		<View style={styles.container}>
			<Onboarding
				DoneButtonComponent={(props) => (
					<CustomDoneButton
						{...props}
						title="Done"
						backgroundColor="#ffffff"
						fadeInDuration={500}
					/>
				)}
				NextButtonComponent={(props) => (
					<CustomNextButton
						{...props}
						nextLabel="Next"
						backgroundColor="#ffffff"
					/>
				)}
				SkipButtonComponent={(props) => (
					<CustomNextButton
						{...props}
						nextLabel="Skip"
						backgroundColor="#ffffff"
					/>
				)}
				bottomBarHighlight={false}
				bottomBarStyle={styles.customBottomBar}
				onSkip={handleSubmit}
				onDone={handleSubmit}
				pages={[
					{
						backgroundColor: '#fff',
						image: (
							<View>
								<LottieView
									source={require('../../assets/images/OnboardingOne.json')}
									autoPlay
									style={styles.lottie}
								/>
							</View>
						),
						title: 'Welcome to GradLoh!',
						subtitle:
							'Start your graduation journey with these powerful features.',
						titleStyles: styles.welcomeTitle,
						subTitleStyles: styles.welcomeText
					},
					{
						backgroundColor: '#fff',
						image: (
							<View>
								<LottieView
									source={require('../../assets/images/OnboardingTwo.json')}
									autoPlay
									style={styles.lottie}
								/>
							</View>
						),
						title: 'Personalised dashboard',
						subtitle:
							'Interactive and informative charts to ensure that you graduate on time.',
						titleStyles: styles.welcomeTitle,
						subTitleStyles: styles.welcomeText
					},
					{
						backgroundColor: '#fff',
						image: (
							<View>
								<LottieView
									source={require('../../assets/images/OnboardingThree.json')}
									autoPlay
									style={styles.lottie}
								/>
							</View>
						),
						title: 'Course Builder',
						subtitle:
							'Easily manage and populate your modules all in one place.',
						titleStyles: styles.welcomeTitle,
						subTitleStyles: styles.welcomeText
					},
					{
						backgroundColor: '#fff',
						image: (
							<View>
								<LottieView
									source={require('../../assets/images/OnboardingFour.json')}
									autoPlay
									style={styles.lottietwo}
								/>
							</View>
						),
						title: 'Henry',
						subtitle:
							'Your smart assistant, designed to give personalized suggestions based on your preferences.',
						titleStyles: styles.welcomeTitle,
						subTitleStyles: styles.welcomeText
					},
					{
						backgroundColor: '#fff',
						image: (
							<View>
								<LottieView
									source={require('../../assets/images/OnboardingFive.json')}
									autoPlay
									style={styles.lottietwo}
								/>
								<Text style={styles.welcomeTitle}></Text>
								<Text style={styles.welcomeText}></Text>
							</View>
						),
						title: "Let's get started",
						subtitle: 'Where got time? GradLoh',
						titleStyles: styles.welcomeTitle,
						subTitleStyles: styles.welcomeText
					}
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	lottie: {
		width: Dimensions.get('window').width * 1, // Adjust the size as needed
		height: Dimensions.get('window').width * 1 // Adjust the size as needed
	},
	lottietwo: {
		marginLeft: 20,
		width: Dimensions.get('window').width * 0.9, // Adjust the size as needed
		height: Dimensions.get('window').width * 1 // Adjust the size as needed
	},
	welcomeTitle: {
		fontFamily: 'Lexend_700Bold',
		color: '#EF7C00',
		textAlign: 'center',
		fontSize: 24,
		marginBottom: 12
	},
	welcomeText: {
		fontFamily: 'Lexend_600SemiBold',
		color: '#EF7C00',
		textAlign: 'center',
		fontSize: 14,
		marginHorizontal: 30
	},
	customBottomBar: {
		backgroundColor: 'transparent'
	}
});
