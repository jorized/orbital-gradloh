import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
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
import CheckBoxWithLabel from '../../components/Auth/CheckBoxWithLabel';
import TermsAndConditionsModal from '../../components/Auth/TermsAndConditionsModal';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const authContext = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonsHidden, setButtonsHidden] = useState(false);
  const [errors, setErrors] = useState({
    nickname: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false
  });
  const [errorMessages, setErrorMessages] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: ''
  });
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const nicknameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const inputs = [
    {
      ref: nicknameRef,
      keyboardType: 'default',
      value: nickname,
      onChangeText: setNickname,
      label: 'Nickname*',
      error: errors.nickname,
      errorMessage: errorMessages.nickname
    },
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
    },
    {
      ref: confirmPasswordRef,
      keyboardType: 'default',
      value: confirmPassword,
      onChangeText: setConfirmPassword,
      label: 'Confirm password*',
      isPassword: true,
      error: errors.confirmPassword,
      errorMessage: errorMessages.confirmPassword
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

  const handleRegister = async () => {
    let hasError = false;
    const newErrors = {
      nickname: false,
      email: false,
      password: false,
      confirmPassword: false,
      terms: false
    };
    const newErrorMessages = {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: ''
    };

    if (!nickname) {
      newErrors.nickname = true;
      newErrorMessages.nickname = 'This field is required.';
      hasError = true;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      newErrorMessages.confirmPassword = 'This field is required.';
      hasError = true;
    }


    if (!termsAccepted) {
      newErrors.terms = true;
      newErrorMessages.terms = 'You must accept the terms and conditions.';
      hasError = true;
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);

	if (!hasError) {
		setLoading(true);
		try {
		  const response = await publicAxios.post('/processregister', {
			nickname,
			email,
			password,
			confirmPassword
		  });
		  setLoading(false);
		  navigation.push('ProfileSetUpOneScreen', {
			nickname: response.data.nickname,
			email: response.data.email,
			password: response.data.password
		  });
		} catch (error) {
		  setLoading(false);
		  Toast.show({
			type: 'error',
			text1: 'Error',
			text2: error.response ? error.response.data.message : 'Server is offline',
			visibilityTime: 5000,
			autoHide: true,
			position: 'bottom',
			bottomOffset: 40
		  });
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
        <Text style={styles.loginTitle}>Sign up</Text>
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
              testID={index === 0 ? 'nicknameInput' : index === 1 ? 'emailInput' : index === 2 ? 'passwordInput' : index === 3 ? 'confirmPasswordInput' : undefined} // Assign testID for password inputs
            />
          )
        )}
        <CheckBoxWithLabel
          label={
            <Text
              style={!errors.terms ? styles.termsLabel : styles.termsLabelError}
            >
              I agree to the{' '}
              <Text
                style={!errors.terms ? styles.underline : styles.underlineError}
                onPress={() => setIsModalVisible(true)}
              >
                Terms and Conditions*
              </Text>
            </Text>
          }
          value={termsAccepted}
          onValueChange={setTermsAccepted}
          error={errors.terms} // Pass error state for terms
          errorMessage={errorMessages.terms} // Pass error message for terms
		  testID="termsCheckBox"
        />
        {Platform.OS === 'android' ? (
          <TouchableNativeFeedback
            onPress={loading ? null : handleRegister}
            background={TouchableNativeFeedback.Ripple('#fff', false)}
            disabled={loading}
            testID="registerButton"
          >
            <View
              style={[styles.loginPressable, loading && styles.disabledPressable]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.loginText}>Sign up</Text>
              )}
            </View>
          </TouchableNativeFeedback>
        ) : (
          <TouchableOpacity
            style={[styles.loginPressable, loading && styles.disabledPressable]}
            onPress={loading ? null : handleRegister}
            disabled={loading}
            testID="registerButton"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.loginText}>Sign up</Text>
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
      <TermsAndConditionsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
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
  termsLabel: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'Lexend_400Regular'
  },
  underline: {
    color: '#EF7C00',
    textDecorationLine: 'underline'
  },
  termsLabelError: {
    color: '#D00E17',
    fontSize: 14,
    fontFamily: 'Lexend_400Regular'
  },
  underlineError: {
    color: '#D00E17',
    textDecorationLine: 'underline'
  },
  loginPressable: {
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
  disabledPressable: {
    opacity: 0.5
  }
});
