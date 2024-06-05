import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	Platform,
	TouchableNativeFeedback,
	ActivityIndicator,
	LogBox
} from 'react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_300Light,
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { Dropdown } from 'react-native-element-dropdown';
import { forwardRef, useContext, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBoxWithLabel from '../components/CheckBoxWithLabel';
import DropdownWithErrorHandling from '../components/DropdownWithErrorHandling';
import SelectableButton from '../components/SelectableButton';
import { AxiosContext } from '../contexts/AxiosContext';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';

LogBox.ignoreLogs([
	'Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'
]);

export default function ProfileSetUpTwoScreen() {
	const navigation = useNavigation();

	const [loading, setLoading] = useState(false);

	const authContext = useContext(AuthContext);
	const { publicAxios } = useContext(AxiosContext);

	const [facultyValue, setFacultyValue] = useState('');
	const [majorValue, setMajorValue] = useState('');
	const [isFacultyFocus, setIsFacultyFocus] = useState(false);
	const [isMajorFocus, setIsMajorFocus] = useState(false);
	const [isSelectedSecondMajor, setIsSelectedSecondMajor] = useState(false);
	const [isSelectedMinor, setIsSelectedMinor] = useState(false);
	const [facultyError, setFacultyError] = useState(false);
	const [majorError, setMajorError] = useState(false);

	const route = useRoute();
	const { nickname, email, password, enrolmentYear } = route.params || {};

	const toastConfig = {
		warning: ({ text1, text2, props }) => (
			<View style={[styles.toastContainer, styles.warningToast]}>
				<View style={styles.textContainer}>
					<Text style={styles.toastText1}>{text1}</Text>
					{text2 ? (
						<Text style={styles.toastText2}>{text2}</Text>
					) : null}
				</View>
				<TouchableOpacity
					onPress={() => Toast.hide()}
					style={styles.closeButton}
				>
					<Text style={styles.closeButtonText}>✕</Text>
				</TouchableOpacity>
			</View>
		),
		success: ({ text1, text2, props }) => (
			<View style={[styles.toastContainer, styles.successToast]}>
				<View style={styles.textContainer}>
					<Text style={styles.toastText1}>{text1}</Text>
					{text2 ? (
						<Text style={styles.toastText2}>{text2}</Text>
					) : null}
				</View>
				<TouchableOpacity
					onPress={() => Toast.hide()}
					style={styles.closeButton}
				>
					<Text style={styles.closeButtonText}>✕</Text>
				</TouchableOpacity>
			</View>
		)
	};

	const CustomToast = forwardRef((props, ref) => (
		<Toast ref={ref} config={toastConfig} />
	));

	const facultyData = [
		{ label: 'Arts and Social Sciences (FASS)', value: 'FASS' },
		{ label: 'Business (SOB)', value: 'SOB' },
		{ label: 'Computing (SOC)', value: 'SOC' },
		{ label: 'Design and Engineering (CDE)', value: 'CDE' },
		{ label: 'Science (FOS)', value: 'FOS' }
	];

	const majorData = {
		FASS: [
			{ label: 'Anthropology', value: 'Anthropology' },
			{ label: 'Chinese Studies', value: 'Chinese Studies' },
			{
				label: 'Communications and New Media',
				value: 'Communications and New Media'
			},
			{ label: 'Economics', value: 'Economics' }
			// Add other majors for FASS
		],
		SOB: [
			{
				label: 'Business Administration',
				value: 'Business Administration'
			},
			{ label: 'Accountancy', value: 'Accountancy' }
			// Add other majors for SOB
		],
		SOC: [
			{ label: 'Business Analytics', value: 'Business Analytics' },
			{ label: 'Computer Engineering', value: 'Computer Engineering' },
			{ label: 'Computer Science', value: 'Computer Science' },
			{ label: 'Information Security', value: 'Information Security' },
			{ label: 'Information Systems', value: 'Information Systems' }
			// Add other majors for SOC
		],
		CDE: [
			{ label: 'Architecture', value: 'Architecture' },
			{ label: 'Industrial Design', value: 'Industrial Design' },
			{ label: 'Real Estate', value: 'Real Estate' },
			{ label: 'Biomedical Engineering', value: 'Biomedical Engineering' }
			// Add other majors for CDE
		],
		FOS: [
			{ label: 'Applied Mathematics', value: 'Applied Mathematics' },
			{ label: 'Chemistry', value: 'Chemistry' },
			{ label: 'Computational Biology', value: 'Computational Biology' },
			{
				label: 'Data Science and Analytics',
				value: 'Data Science and Analytics'
			}
			// Add other majors for FOS
		]
	};
	const filteredMajorData = facultyValue ? majorData[facultyValue] : [];

	const [fontsLoaded] = useFonts({
		Lexend_300Light,
		Lexend_400Regular,
		Lexend_600SemiBold,
		Lexend_700Bold
	});

	const handleSubmit = async () => {
		if (!facultyValue) {
			setFacultyError(true);
		}

		if (!majorValue) {
			setMajorError(true);
		} else {
			setFacultyError(false);
			setMajorError(false);
			// *Redirecting to different pages based on options*
			//If select second major, redirect to
			if (isSelectedSecondMajor) {
				navigation.push('ProfileSetUpThreeScreen', {
					nickname: nickname,
					email: email,
					password: password,
					enrolmentYear: enrolmentYear,
					homeFaculty: facultyValue,
					primaryMajor: majorValue,
					choseSecondMajor: isSelectedSecondMajor,
					choseMinor: isSelectedMinor
				});
			} else {
				if (isSelectedMinor) {
					//If only select minor
					navigation.push('ProfileSetUpFourScreen', {
						nickname: nickname,
						email: email,
						password: password,
						enrolmentYear: enrolmentYear,
						homeFaculty: facultyValue,
						primaryMajor: majorValue,
						choseSecondMajor: isSelectedSecondMajor,
						choseMinor: isSelectedMinor
					});
				} else {
					//If not go to onboarding
					setLoading(true);
					// Create the user account first
					try {
						const homeFaculty = facultyValue;
						const primaryMajor = majorValue;
						const secondaryMajor = '';
						const firstMinor = '';
						const secondMinor = '';
						const response = await publicAxios.post('/register', {
							nickname,
							email,
							password,
							enrolmentYear,
							primaryMajor,
							secondaryMajor,
							firstMinor,
							secondMinor,
							homeFaculty
						});
						setLoading(false);

						const { accessToken, refreshToken } = response.data;
						//Navigate to onboarding screen one
						authContext.setAuthState({
							accessToken,
							refreshToken
						});
						navigation.push('OnboardingScreen', {
							email,
							accessToken: accessToken,
							refreshToken: refreshToken
						});
					} catch (error) {
						console.log(error);
						setLoading(false);
						if (!error.response) {
							Toast.show({
								type: 'warning',
								text1: 'Error',
								text2: 'Server is offline',
								visibilityTime: 5000,
								autoHide: true,
								position: 'bottom',
								bottomOffset: 40
							});
						} else {
							Toast.show({
								type: 'warning',
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
			}
		}
	};

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<Text style={styles.profileSetUpTitle}>Profile Setup</Text>
				<Text style={styles.facultyTitleText}>
					*Please select your faculty
				</Text>

				<DropdownWithErrorHandling
					data={facultyData}
					value={facultyValue}
					placeholder="Select faculty*"
					error={facultyError}
					setValue={setFacultyValue}
					setIsFocus={setIsFacultyFocus}
					setError={setFacultyError}
				/>

				{facultyValue && (
					<>
						<Text style={styles.majorTitleText}>
							*Please select your primary major
						</Text>
						<DropdownWithErrorHandling
							data={filteredMajorData}
							value={majorValue}
							placeholder="Select major*"
							error={majorError}
							setValue={setMajorValue}
							setIsFocus={setIsMajorFocus}
							setError={setMajorError}
							isSearch={true}
							searchPlaceholder="Search..."
						/>
					</>
				)}

				{majorValue && (
					<>
						<Text style={styles.optionalTitleText}>
							(Optional) Please select all that apply :
						</Text>
						<Text style={styles.optionalText}>
							I am currently taking a...
						</Text>
						<SelectableButton
							label="Second Major"
							isSelected={isSelectedSecondMajor}
							setIsSelected={setIsSelectedSecondMajor}
						/>
						{/* <SelectableButton
                            label="Minor" 
                            isSelected={isSelectedMinor} 
                            setIsSelected={setIsSelectedMinor} 
                        /> */}
					</>
				)}
			</View>
			{Platform.OS === 'android' ? (
				<TouchableNativeFeedback
					onPress={loading ? null : handleSubmit}
					background={TouchableNativeFeedback.Ripple('#fff', false)}
					disabled={loading}
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
							<Text style={styles.loginText}>Next</Text>
						)}
					</View>
				</TouchableNativeFeedback>
			) : (
				<TouchableOpacity
					style={[
						styles.loginPressable,
						loading && styles.disabledPressable
					]}
					onPress={loading ? null : handleSubmit}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#FFF" />
					) : (
						<Text style={styles.loginText}>Next</Text>
					)}
				</TouchableOpacity>
			)}
			<CustomToast />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 36,
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'space-between'
	},
	profileSetUpTitle: {
		fontFamily: 'Lexend_600SemiBold',
		color: '#2C2C2E',
		fontSize: 40,
		marginBottom: 24
	},
	facultyTitleText: {
		fontFamily: 'Lexend_300Light',
		fontSize: 16,
		marginBottom: 24
	},
	majorTitleText: {
		marginTop: 24,
		fontFamily: 'Lexend_300Light',
		fontSize: 16,
		marginBottom: 24
	},
	optionalTitleText: {
		marginTop: 24,
		fontFamily: 'Lexend_300Light',
		fontSize: 14
	},
	optionalText: {
		fontFamily: 'Lexend_300Light',
		fontSize: 14,
		marginBottom: 24
	},
	dropdownOne: {
		borderBottomWidth: 1,
		borderBottomColor: '#CBCBCB',
		marginBottom: 24
	},
	dropdownTwo: {
		borderBottomWidth: 1,
		borderBottomColor: '#CBCBCB',
		marginBottom: 24
	},
	dropdownPlaceholder: {
		color: '#CBCBCB'
	},
	loginPressable: {
		padding: 16,
		backgroundColor: '#EF7C00',
		borderRadius: 12
	},
	loginText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 18,
		fontFamily: 'Lexend_400Regular'
	},
	toastContainer: {
		width: '90%',
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5
	},
	warningToast: {
		backgroundColor: '#D00E17'
	},
	successToast: {
		backgroundColor: '#28a745'
	},
	textContainer: {
		flex: 1,
		flexShrink: 1
	},
	toastText1: {
		fontSize: 16,
		color: 'white'
	},
	toastText2: {
		fontSize: 12,
		color: 'white'
	},
	closeButton: {
		padding: 5
	},
	closeButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white'
	}
});
