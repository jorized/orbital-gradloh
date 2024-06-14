import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_300Light,
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { forwardRef, useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropdownWithErrorHandling from '../../components/Auth/DropdownWithErrorHandling';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';
import Toast from 'react-native-toast-message';
import Faculties from '../../data/Faculties.json';
import SecondaryMajors from '../../data/SecondaryMajors.json';
import MinorsData from '../../data/MinorsData.json';

export default function ProfileSetUpThreeScreen() {
	const navigation = useNavigation();

	const [loading, setLoading] = useState(false);

	const authContext = useContext(AuthContext);
	const { publicAxios } = useContext(AxiosContext);

	const [facultyValue, setFacultyValue] = useState('');
	const [majorValue, setMajorValue] = useState('');
	const [minorFacultyValue, setMinorFacultyValue] = useState('');
	const [minorValue, setMinorValue] = useState('');
	const [isFacultyFocus, setIsFacultyFocus] = useState(false);
	const [isMajorFocus, setIsMajorFocus] = useState(false);
	const [isMinorFacultyFocus, setIsMinorFacultyFocus] = useState(false);
	const [isMinorFocus, setIsMinorFocus] = useState(false);

	const [facultyError, setFacultyError] = useState(false);
	const [majorError, setMajorError] = useState(false);
	const [minorFacultyError, setMinorFacultyError] = useState(false);
	const [minorError, setMinorError] = useState(false);

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

	const route = useRoute();
	const {
		nickname,
		email,
		password,
		enrolmentYear,
		primaryMajor,
		choseMinor,
		homeFaculty
	} = route.params || {};

	const facultyData = Faculties;
	const secondMajorRestrictions = SecondaryMajors;
	const minors = MinorsData;

	const restrictedFaculties = secondMajorRestrictions
		.filter((secondMajor) =>
			secondMajor.restrictedWith.includes(primaryMajor)
		)
		.map((secondMajor) => secondMajor.faculty);

	const filteredFaculty = facultyData.filter(
		(faculty) => !restrictedFaculties.includes(faculty.value)
	);

	const filteredMajorData = secondMajorRestrictions.filter(
		(secondMajor) =>
			secondMajor.faculty === facultyValue &&
			!secondMajor.restrictedWith.includes(primaryMajor)
	);

	const filteredMinorData = minors.filter((minor) => {
		return minor.faculty === minorFacultyValue;
	});

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
		}

		if (choseMinor) {
			if (!minorFacultyValue) {
				setMinorFacultyError(true);
			}
	
			if (!minorValue) {
				setMinorError(true);
			}
		}

 		else {
			setFacultyError(false);
			setMajorError(false);
			setMinorFacultyError(false);
			setMinorError(false);
			setLoading(true);
			// Create the user account first
			try {
				const secondaryMajor = majorValue;
				const firstMinor = minorValue;
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
				//Navigate to onboarding screen
				authContext.setAuthState({
					accessToken,
					refreshToken
				});
				navigation.push('OnboardingScreen', {
					email: email,
					accessToken: accessToken,
					refreshToken: refreshToken
				});
			} catch (error) {
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
	};

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<Text style={styles.profileSetUpTitle}>Profile Setup</Text>
				<Text style={styles.facultyTitleText}>
					*Please select your secondary major's faculty
				</Text>

				<DropdownWithErrorHandling
					data={filteredFaculty}
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
							*Please select your secondary major
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

				{choseMinor && majorValue && (
					<>
						<Text style={styles.minorFacultyTitleText}>
							*Please select your minor's faculty
						</Text>

						<DropdownWithErrorHandling
							data={facultyData}
							value={minorFacultyValue}
							placeholder="Select faculty*"
							error={minorFacultyError}
							setValue={setMinorFacultyValue}
							setIsFocus={setIsMinorFacultyFocus}
							setError={setMinorFacultyError}
						/>
					</>
				)}

				{minorFacultyValue && (
					<>
						<Text style={styles.majorTitleText}>
							*Please select your minor
						</Text>
						<DropdownWithErrorHandling
							data={filteredMinorData}
							value={minorValue}
							placeholder="Select minor*"
							error={minorError}
							setValue={setMinorValue}
							setIsFocus={setIsMinorFocus}
							setError={setMinorError}
							isSearch={true}
							searchPlaceholder="Search..."
						/>
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
	minorFacultyTitleText: {
		marginTop: 24,
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
