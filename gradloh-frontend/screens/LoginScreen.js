import React, { useState, useRef, forwardRef, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TouchableNativeFeedback, TouchableOpacity, } from 'react-native';
import { useFonts } from 'expo-font';
import { Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory';
import FloatingLabelInput from '../components/FloatingLabelInput';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../contexts/AuthContext';
import { AxiosContext } from '../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonsHidden, setButtonsHidden] = useState(false);
    const [errors, setErrors] = useState({ email: false, password: false });
    const [errorMessages, setErrorMessages] = useState({ email: '', password: '' });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const inputs = [
        { ref: emailRef, keyboardType: 'email-address', value: email, onChangeText: setEmail, label: 'Email address*', error: errors.email, errorMessage: errorMessages.email },
        { ref: passwordRef, keyboardType: 'default', value: password, onChangeText: setPassword, label: 'Password*', isPassword: true, error: errors.password, errorMessage: errorMessages.password }
    ];

    const [activeInputIndex, setActiveInputIndex] = useState(0);
    const [nextFocusDisabled, setNextFocusDisabled] = useState(false);
    const [previousFocusDisabled, setPreviousFocusDisabled] = useState(false);

    const toastConfig = {
        warning: ({ text1, text2, props }) => (
          <View style={styles.toastContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.toastText1}>{text1}</Text>
              {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ),
    };

    const CustomToast = forwardRef((props, ref) => (
        <Toast ref={ref} config={toastConfig} />
    ));

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
        emailRef.current.blur();
        passwordRef.current.blur();
    };

    const handleSignIn = async () => {
        let hasError = false;
        const newErrors = { email: false, password: false };
        const newErrorMessages = { email: '', password: '' };
      
        if (!email) {
          newErrors.email = true;
          newErrorMessages.email = 'Enter a valid email';
          hasError = true;
        }
      
        if (!password) {
          newErrors.password = true;
          newErrorMessages.password = 'Enter a valid password';
          hasError = true;
        }
      
        setErrors(newErrors);
        setErrorMessages(newErrorMessages);
      
        if (!hasError) {
          try {
            const response = await publicAxios.post('/login', {
              email,
              password,
            });
      
            const { accessToken, refreshToken } = response.data;
      
            // Store tokens in SecureStore
            await SecureStore.setItemAsync(
              'token',
              JSON.stringify({
                accessToken,
                refreshToken,
              })
            );
      
            // Update state only after storing the token
            authContext.setAuthState({
              accessToken,
              refreshToken,
              authenticated: true,
            });

          } catch (error) {
            Toast.show({
              type: 'warning',
              text1: 'Error',
              text2: error.response.data.message,
              visibilityTime: 3000,
              autoHide: false,
              position: 'bottom',
              bottomOffset: 40,
            });
          }
        }
      };
      

    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_600SemiBold,
        Lexend_700Bold,
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.loginTitle}>Sign in</Text>
                {inputs.map(({ ref, label, value, onChangeText, keyboardType, isPassword, error, errorMessage }, index) => (
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
                />
                
                ))}
                <Pressable>
                    <Text style={styles.forgotPasswordText}>
                        Forgot password?
                    </Text>
                </Pressable>
                {Platform.OS === 'android' ? (
                <TouchableNativeFeedback onPress={handleSignIn} background={TouchableNativeFeedback.Ripple('#fff', false)}>
                    <View style={styles.loginPressable}>
                    <Text style={styles.loginText}>Sign in</Text>
                    </View>
                </TouchableNativeFeedback>
                ) : (
                <TouchableOpacity style={styles.loginPressable} onPress={handleSignIn}>
                    <Text style={styles.loginText}>Sign in</Text>
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
            />
        )}
        <CustomToast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        padding: 36,
    },
    loginTitle: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#2C2C2E',
        fontSize: 40,
        marginBottom: 24,
    },
    loginPressable: {
        marginTop: 20,
        padding: 16,
        backgroundColor: "#EF7C00",
        borderRadius: 12
        },
    loginText: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
        fontFamily: "Lexend_400Regular"
    },
    forgotPasswordText: {
        color: "#EF7C00",
        fontFamily: "Lexend_400Regular"
    },
    toastContainer: {
        height: 60,
        width: '90%',
        backgroundColor: '#D00E17',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
      textContainer: {
        flex: 1,
      },
      toastText1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
      },
      toastText2: {
        fontSize: 14,
        color: 'white',
      },
      closeButton: {
        padding: 5,
      },
      closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
});

