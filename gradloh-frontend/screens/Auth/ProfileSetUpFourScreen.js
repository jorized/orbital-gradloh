import { useNavigation, useRoute } from '@react-navigation/native';
import React, { forwardRef, useContext, useState } from 'react';
import { ScrollView, View, Text, TouchableNativeFeedback, ActivityIndicator, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DropdownWithErrorHandling from '../../components/Auth/DropdownWithErrorHandling';
import Toast from 'react-native-toast-message';
import Faculties from '../../data/Faculties.json';
import MinorsData from '../../data/MinorsData.json';
import { AxiosContext } from '../../contexts/AxiosContext';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProfileSetUpFourScreen() {

    const navigation = useNavigation();

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);

    const [loading, setLoading] = useState(false);

    const [numberOfMinorsValue, setNumberOfMinorsValue] = useState('');
    const [isNumberOfMinorsFocus, setIsNumberOfMinorsFocus] = useState(false);
    const [numberOfMinorsError, setNumberOfMinorsError] = useState(false);

    const [minorFacultyValue, setMinorFacultyValue] = useState('');
    const [isMinorFacultyFocus, setIsMinorFacultyFocus] = useState(false);
	const [minorFacultyError, setMinorFacultyError] = useState(false);

    const [minorValue, setMinorValue] = useState('');
    const [isMinorFocus, setIsMinorFocus] = useState(false);
    const [minorError, setMinorError] = useState(false);

    const [secondMinorFacultyValue, setSecondMinorFacultyValue] = useState('');
    const [isSecondMinorFacultyFocus, setIsSecondMinorFacultyFocus] = useState(false);
	const [secondMinorFacultyError, setSecondMinorFacultyError] = useState(false);

    const [secondMinorValue, setSecondMinorValue] = useState('');
    const [isSecondMinorFocus, setIsSecondMinorFocus] = useState(false);
    const [secondMinorError, setSecondMinorError] = useState(false);

    const facultyData = Faculties;
    const minors = MinorsData;

    
	const route = useRoute();
	const {
		nickname,
		email,
		password,
		enrolmentYear,
		primaryMajor,
		homeFaculty
	} = route.params || {};

    const filteredMinorData = minors.filter((minor) => {
		return minor.faculty === minorFacultyValue;
	}).filter((minor) => {
        return minor.value !== primaryMajor;
    });

    const filteredSecondMinorData = minors.filter((minor) => {
        return minor.faculty === secondMinorFacultyValue;
      }).filter((minor) => {
        return minor.value !== minorValue;
      });


    const numberOfMinors = [
        { label : "1", value : "1"},
        { label : "2", value : "2"}
    ]

    const handleSubmit = async () => {

        if (!numberOfMinorsValue) {
			setNumberOfMinorsError(true);
		}

        if (!minorFacultyValue) {
            setMinorFacultyError(true);
        }

        if (!minorValue) {
            setMinorError(true);
        }

        if (numberOfMinorsValue == '2' && !secondMinorFacultyValue) {
            setSecondMinorFacultyError(true);
        }

        if (numberOfMinorsValue == '2' && !secondMinorValue) {
            setSecondMinorError(true);
        }
        
        else {
            setNumberOfMinorsError(false);
            setMinorFacultyError(false);
            setMinorError(false);
            setSecondMinorFacultyError(false);
            setSecondMinorError(false);
            setLoading(true);

            try {
                console.log(publicAxios)
				const secondaryMajor = '';
				const firstMinor = minorValue;
				const secondMinor = secondMinorValue;
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


    }


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

	return (
		<View style={styles.container}>
			<ScrollView style={styles.form}>
				<Text style={styles.profileSetUpTitle}>Profile Setup</Text>
				<Text style={styles.facultyTitleText}>
					*Please select your number of minors
				</Text>

				<DropdownWithErrorHandling
					data={numberOfMinors}
					value={numberOfMinorsValue}
					placeholder="Select number*"
					error={numberOfMinorsError}
					setValue={setNumberOfMinorsValue}
					setIsFocus={setIsNumberOfMinorsFocus}
					setError={setNumberOfMinorsError}
				/>

                {numberOfMinorsValue && (
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

                {numberOfMinorsValue == '2' && minorValue && (
					<>
                        <Text style={styles.minorFacultyTitleText}>
                            *Please select your second minor's faculty
                        </Text>

                        <DropdownWithErrorHandling
                            data={facultyData}
                            value={secondMinorFacultyValue}
                            placeholder="Select faculty*"
                            error={secondMinorFacultyError}
                            setValue={setSecondMinorFacultyValue}
                            setIsFocus={setIsSecondMinorFacultyFocus}
                            setError={setSecondMinorFacultyError}
                        />
                    </>
				)}

                {secondMinorFacultyValue && (
					<>
						<Text style={styles.majorTitleText}>
							*Please select your second minor
						</Text>
						<DropdownWithErrorHandling
							data={filteredSecondMinorData}
							value={secondMinorValue}
							placeholder="Select minor*"
							error={secondMinorError}
							setValue={setSecondMinorValue}
							setIsFocus={setIsSecondMinorFocus}
							setError={setSecondMinorError}
							isSearch={true}
							searchPlaceholder="Search..."
						/>
                    </>
				)}

            
			</ScrollView>
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
};

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

