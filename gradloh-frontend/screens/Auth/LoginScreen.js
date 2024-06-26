import React, {
	useState,
	useRef,
	forwardRef,
	useContext,
	useEffect
} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import FloatingLabelInput from '../../components/Auth/FloatingLabelInput';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LoginScreen() {
	const navigation = useNavigation();

	const authContext = useContext(AuthContext);
	const { publicAxios } = useContext(AxiosContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [buttonsHidden, setButtonsHidden] = useState(false);
	const [errors, setErrors] = useState({ email: false, password: false });
	const [errorMessages, setErrorMessages] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const inputs = [
		{
			ref: emailRef,
			keyboardType: 'email-address',
			value: email,
			onChangeText: setEmail,
			label: 'Email address*',
			error: errors.email,
			errorMessage: errorMessages.email
		},
		{
			ref: passwordRef,
			keyboardType: 'default',
			value: password,
			onChangeText: setPassword,
			label: 'Password*',
			isPassword: true,
			error: errors.password,
			errorMessage: errorMessages.password
		}
	];

	const [activeInputIndex, setActiveInputIndex] = useState(0);
	const [nextFocusDisabled, setNextFocusDisabled] = useState(false);
	const [previousFocusDisabled, setPreviousFocusDisabled] = useState(false);

	const handleFocus = (index) => () => {
		setActiveInputIndex(index);
		setNextFocusDisabled(index === inputs.length - 1);
		setPreviousFocusDisabled(index === 0);
	};

	const handleFocusNext = () => {
		if (!nextFocusDisabled) {
			inputs[activeInputIndex + 1].ref.current.focus();
		}
	};

	const handleFocusPrevious = () => {
		if (!previousFocusDisabled) {
			inputs[activeInputIndex - 1].ref.current.focus();
		}
	};

	const handleDone = () => {
		inputs.forEach((input) => input.ref.current.blur());
	};

	const handleSignIn = async () => {
		let hasError = false;
		const newErrors = { email: false, password: false };
		const newErrorMessages = { email: '', password: '' };

		if (!email) {
			newErrors.email = true;
			newErrorMessages.email = 'This field is required.';
			hasError = true;
		}

		if (!password) {
			newErrors.password = true;
			newErrorMessages.password = 'This field is required.';
			hasError = true;
		}

		setErrors(newErrors);
		setErrorMessages(newErrorMessages);

		if (!hasError) {
			setLoading(true);
			try {
				const response = await publicAxios.post('/login', {
					email,
					password
				});
				setLoading(false);
				const { nickname, accessToken, refreshToken, completedOnboard } =
					response.data;
				if (!completedOnboard) {
					authContext.setAuthState({
						accessToken,
						refreshToken
					});
					navigation.push('OnboardingScreen', {
						nickname : nickname,
						email: email,
						accessToken: accessToken,
						refreshToken: refreshToken
					});
				} else {
					// Store user details and tokens in SecureStore
					await SecureStore.setItemAsync(
						'token',
						JSON.stringify({
							accessToken,
							refreshToken
						})
					);
					await SecureStore.setItemAsync(
						'userprofiledetails',
						JSON.stringify({
							nickname,
							email
						})
					);
					// Update state only after storing the token
					authContext.setAuthState({
						accessToken,
						refreshToken,
						authenticated: true
					});
				}
			} catch (error) {
				setLoading(false);
				if (!error.response) {
					Toast.show({
						type: 'error',
						text1: 'Error',
						text2: 'Server is offline',
						visibilityTime: 5000,
						autoHide: true,
						position: 'bottom',
						bottomOffset: 40
					});
				} else {
					Toast.show({
						type: 'error',
						text1: 'Error',
						text2: error.response.data.message,
						visibilityTime: 5000,
						autoHide: true,
						position: 'bottom',
						bottomOffset: 40
					});
				}
			}
		}
	};

	const [fontsLoaded] = useFonts({
		Lexend_400Regular,
		Lexend_600SemiBold,
		Lexend_700Bold
	});

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<Text style={styles.loginTitle}>Sign in</Text>
				{inputs.map(
					(
						{
							ref,
							label,
							value,
							onChangeText,
							keyboardType,
							isPassword,
							error,
							errorMessage
						},
						index
					) => (
						<FloatingLabelInput
							key={index}
							ref={ref}
							label={label}
							value={value}
							onChangeText={onChangeText}
							keyboardType={keyboardType}
							isPassword={isPassword}
							onFocus={handleFocus(index)}
							error={error}
							errorMessage={errorMessage}
							testID= {index === 0 ? 'emailInput' : index === 1 ? 'passwordInput' : undefined}
						/>
					)
				)}
				<Pressable
					onPress={() => navigation.push('ForgotPasswordScreen')}
				>
					<Text style={styles.forgotPasswordText}>
						Forgot password?
					</Text>
				</Pressable>
				{Platform.OS === 'android' ? (
					<TouchableNativeFeedback
						onPress={loading ? null : handleSignIn}
						background={TouchableNativeFeedback.Ripple(
							'#fff',
							false
						)}
						disabled={loading}
						testID='loginButton'
					>
						<View
							style={[
								styles.loginPressable,
								loading && styles.disabledPressable
							]}
						>
							{loading ? (
								<ActivityIndicator size="small" color="#FFF" />
							) : (
								<Text style={styles.loginText}>Sign in</Text>
							)}
						</View>
					</TouchableNativeFeedback>
				) : (
					<TouchableOpacity
						style={[
							styles.loginPressable,
							loading && styles.disabledPressable
						]}
						onPress={loading ? null : handleSignIn}
						disabled={loading}
						testID='loginButton'
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFF" />
						) : (
							<Text style={styles.loginText}>Sign in</Text>
						)}
					</TouchableOpacity>
				)}
			</ScrollView>
			{Platform.OS === 'ios' && (
				<KeyboardAccessoryNavigation
					nextDisabled={nextFocusDisabled}
					previousDisabled={previousFocusDisabled}
					nextHidden={buttonsHidden}
					previousHidden={buttonsHidden}
					onNext={handleFocusNext}
					onPrevious={handleFocusPrevious}
					doneButtonTitle="Done"
					onDone={handleDone}
					avoidKeyboard
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	contentContainer: {
		padding: 36
	},
	loginTitle: {
		fontFamily: 'Lexend_600SemiBold',
		color: '#2C2C2E',
		fontSize: 40,
		marginBottom: 24
	},
	loginPressable: {
		marginTop: 20,
		padding: 16,
		backgroundColor: '#EF7C00',
		borderRadius: 12
	},
	loginText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
		fontFamily: 'Lexend_400Regular'
	},
	forgotPasswordText: {
		color: '#EF7C00',
		fontFamily: 'Lexend_400Regular'
	},
});
