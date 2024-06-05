import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Pressable,
	Platform,
	TouchableNativeFeedback,
	TouchableOpacity
} from 'react-native';
import { useFonts } from 'expo-font';
import {
	Lexend_300Light,
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropdownWithErrorHandling from '../components/DropdownWithErrorHandling';
import axios from 'axios';
import SelectableButton from '../components/SelectableButton';

export default function ProfileSetUpOneScreen() {
	const navigation = useNavigation();

	const [value, setValue] = useState('');
	const [isFocus, setIsFocus] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const route = useRoute();
	const { nickname, email, password } = route.params || {};

	const data = [
		{ label: '2022/2023', value: '2022-2023' },
		{ label: '2023/2024', value: '2023-2024' }
	];

	const [fontsLoaded] = useFonts({
		Lexend_300Light,
		Lexend_400Regular,
		Lexend_600SemiBold,
		Lexend_700Bold
	});

	const handleSubmit = () => {
		if (!value) {
			setError(true);
		} else {
			setError(false);
			// Handle the submission
			navigation.push('ProfileSetUpTwoScreen', {
				nickname: nickname,
				email: email,
				password: password,
				enrolmentYear: value
			});
		}
	};

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<Text style={styles.profileSetUpTitle}>Profile Setup</Text>
				<Text style={styles.matricText}>
					*Please enter your matriculation year
				</Text>

				<DropdownWithErrorHandling
					data={data}
					value={value}
					placeholder="Select AY*"
					error={error}
					setValue={setValue}
					setIsFocus={setIsFocus}
					setError={setError}
				/>
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
		fontSize: 40,
		marginBottom: 24
	},
	matricText: {
		fontFamily: 'Lexend_300Light',
		fontSize: 16,
		marginBottom: 24
	},
	dropdown: {
		borderBottomWidth: 1,
		borderBottomColor: '#CBCBCB'
	},
	dropdownPlaceholder: {
		color: '#CBCBCB'
	},
	dropdownError: {
		borderBottomColor: '#D00E17'
	},
	dropdownErrorText: {
		color: '#D00E17'
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
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5
	},
	errorIcon: {
		marginRight: 5
	},
	errorMessage: {
		color: '#D00E17',
		fontSize: 12
	}
});
