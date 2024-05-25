import { ActivityIndicator, Platform, ScrollView, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { AxiosContext } from "../contexts/AxiosContext";
import React, { useState, useRef, useContext, forwardRef } from "react";
import { KeyboardAccessoryNavigation } from "react-native-keyboard-accessory";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {

    const navigation = useNavigation();

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);


    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({ email: false });
    const [errorMessages, setErrorMessages] = useState({ email: '' });
    const [buttonsHidden, setButtonsHidden] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRef = useRef(null);

    const [activeInputIndex, setActiveInputIndex] = useState(0);
    const [nextFocusDisabled, setNextFocusDisabled] = useState(false);
    const [previousFocusDisabled, setPreviousFocusDisabled] = useState(false);

    const inputs = [
        { ref: emailRef, keyboardType: 'email-address', value: email, onChangeText: setEmail, label: 'Email address*', error: errors.email, errorMessage: errorMessages.email },
    ];

    
    
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
    };

    const handleResetPassword = async () => {
        let hasError = false;
        const newErrors = { email: false };
        const newErrorMessages = { email: '' };
      
        if (!email) {
          newErrors.email = true;
          newErrorMessages.email = 'This field is required.';
          hasError = true;
        }

        setErrors(newErrors);
        setErrorMessages(newErrorMessages);
        
        if (!hasError) {
            setLoading(true);
            try {
                const response = await publicAxios.post('/sendresetemail', {
                    email,
                });
                setLoading(false);
                //If successful, pass the email response over to the next page
                navigation.push("ResetPasswordConfirmationScreen", { 
                    email,
                    showToast: true,
                    toastMessage: response.data.message
                })
                
            } catch (error) {
                setLoading(false);
                if (!error.response) {
                    Toast.show({
                      type: 'warning',
                      text1: 'Error',
                      text2: "Server is offline",
                      visibilityTime: 5000,
                      autoHide: true,
                      position: 'bottom',
                      bottomOffset: 40,
                    });
                } else {
                    Toast.show({
                        type: 'warning',
                        text1: 'Error',
                        text2: error.response.data.message,
                        visibilityTime: 5000,
                        autoHide: true,
                        position: 'bottom',
                        bottomOffset: 40,
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
              {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ),
        success: ({ text1, text2, props }) => (
            <View style={[styles.toastContainer, styles.successToast]}>
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

    const [fontsLoaded] = useFonts({
        Lexend_300Light,
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
                <Text style={styles.forgotPasswordTitleOne}>Forgot</Text>
                <Text style={styles.forgotPasswordTitleTwo}>Password</Text>
                <Text style={styles.forgotPasswordSubtitle}>Enter your email address below to reset your password.</Text>
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
                {Platform.OS === 'android' ? (
                    <TouchableNativeFeedback
                        onPress={loading ? null : handleResetPassword}
                        background={TouchableNativeFeedback.Ripple('#fff', false)}
                        disabled={loading}
                    >
                        <View style={[styles.loginPressable, loading && styles.disabledPressable]}>
                            {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginText}>Reset Password</Text>}
                        </View>
                    </TouchableNativeFeedback>
                ) : (
                    <TouchableOpacity
                        style={[styles.loginPressable, loading && styles.disabledPressable]}
                        onPress={loading ? null : handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginText}>Reset Password</Text>}
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
        <CustomToast />
        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        padding: 36,
    },
    forgotPasswordTitleOne: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#2C2C2E',
        fontSize: 40,
    },
    forgotPasswordTitleTwo: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#2C2C2E',
        fontSize: 40,
        marginBottom: 24,
    },
    forgotPasswordSubtitle: {
        fontFamily: 'Lexend_300Light',
        marginBottom: 24
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
        elevation: 5,
      },
      warningToast: {
        backgroundColor: '#D00E17',
      },
      successToast: {
        backgroundColor: '#28a745', // Green color for success
      },
      textContainer: {
        flex: 1,
        flexShrink: 1, 
      },
      toastText1: {
        fontSize: 16,
        color: 'white',
      },
      toastText2: {
        fontSize: 12,
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
}