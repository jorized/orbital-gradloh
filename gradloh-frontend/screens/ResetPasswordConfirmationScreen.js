import { Platform, Pressable, ScrollView, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { AxiosContext } from "../contexts/AxiosContext";
import React, { useState, useRef, useContext, forwardRef, useEffect } from "react";
import { KeyboardAccessoryNavigation } from "react-native-keyboard-accessory";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Toast from 'react-native-toast-message';
import { CommonActions, useNavigation, useRoute } from "@react-navigation/native";

export default function ResetPasswordConfirmationScreen() {

    const navigation = useNavigation();

    const route = useRoute();
    const { email, showToast, toastMessage } = route.params;

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);

    const [resendOTPTimer, setResendOTPTimer] = useState(0);

    const [resetOTP, setResetOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ resetOTP: false, newPassword: false, confirmNewPassword: false });
    const [errorMessages, setErrorMessages] = useState({ resetOTP: '', newPassword: '', confirmNewPassword: '' });
    const [buttonsHidden, setButtonsHidden] = useState(false);

    const resetOTPRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmNewPasswordRef = useRef(null);

    const [activeInputIndex, setActiveInputIndex] = useState(0);
    const [nextFocusDisabled, setNextFocusDisabled] = useState(false);
    const [previousFocusDisabled, setPreviousFocusDisabled] = useState(false);

    const inputs = [
        { ref: resetOTPRef, keyboardType: 'default', value: resetOTP, onChangeText: setResetOTP, label: 'OTP*', error: errors.resetOTP, errorMessage: errorMessages.resetOTP },
        { ref: newPasswordRef, keyboardType: 'default', value: newPassword, onChangeText: setNewPassword, label: 'New password*', isPassword: true, error: errors.newPassword, errorMessage: errorMessages.newPassword },
        { ref: confirmNewPasswordRef, keyboardType: 'default', value: confirmNewPassword, onChangeText: setConfirmNewPassword, label: 'Confirm new password*', isPassword: true, error: errors.confirmNewPassword, errorMessage: errorMessages.confirmNewPassword }
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
        resetOTPRef.current.blur();
        newPasswordRef.current.blur();
        confirmNewPasswordRef.current.blur();
    };

    const handleConfirmResetPassword = async () => {
        let hasError = false;
        const newErrors = { resetOTP: false, newPassword: false, confirmNewPassword: false };
        const newErrorMessages = { resetOTP: '', newPassword: '', confirmNewPassword: '' };
      
        if (!resetOTP) {
          newErrors.resetOTP = true;
          newErrorMessages.resetOTP = 'This field is required';
          hasError = true;
        }
        if (!newPassword) {
            newErrors.newPassword = true;
            newErrorMessages.newPassword = 'This field is required';
            hasError = true;
        }
        if (!confirmNewPassword) {
            newErrors.confirmNewPassword = true;
            newErrorMessages.confirmNewPassword = 'This field is required';
            hasError = true;
        }

        setErrors(newErrors);
        setErrorMessages(newErrorMessages);

        if (!hasError) {
            try {
              const response = await publicAxios.post('/resetpassword', {
                email,
                resetOTP,
                newPassword,
                confirmNewPassword
              });
              //response.data
              navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'LandingScreen', params: { showToast: true, toastMessage: response.data.message } },
                    ],
                })
            );
  
            } catch (error) {
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

    const handleResendOTP = async () => {
        setResendOTPTimer(15); // Start 15 seconds countdown
        try {

            const response = await publicAxios.post('/sendresetemail', {
                email,
            });

        } catch (error) {
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

    useEffect(() => {
        if (showToast) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: toastMessage,
                visibilityTime: 5000,
                autoHide: true,
                position: 'bottom',
                bottomOffset: 40,
            });
        }
    }, [showToast, toastMessage]);

    // useEffect for handling the timer
    useEffect(() => {
        let timer;
        if (resendOTPTimer > 0) {
            timer = setInterval(() => {
                setResendOTPTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendOTPTimer]);

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.forgotPasswordTitleOne}>Reset</Text>
                <Text style={styles.forgotPasswordTitleTwo}>New password</Text>
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
                <TouchableNativeFeedback onPress={handleConfirmResetPassword} background={TouchableNativeFeedback.Ripple('#fff', false)}>
                    <View style={styles.loginPressable}>
                    <Text style={styles.loginText}>Submit</Text>
                    </View>
                </TouchableNativeFeedback>
                ) : (
                <TouchableOpacity style={styles.loginPressable} onPress={handleConfirmResetPassword}>
                    <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>
                )}
                <Pressable style={styles.resendOTPPressable} onPress={handleResendOTP} disabled={resendOTPTimer > 0}>
                    <Text style={styles.resendOTPText}>
                        {resendOTPTimer > 0 ? `OTP Resent. Please try again in ${resendOTPTimer} seconds` : 'Resend OTP'}
                    </Text>
                </Pressable>
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
      resendOTPPressable: {
        marginTop: 10
      },
      resendOTPText: {
        fontFamily: "Lexend_400Regular",
        color: "#EF7C00"
      }
}