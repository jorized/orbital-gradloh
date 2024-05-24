import React, { useEffect, useContext, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold } from "@expo-google-fonts/lexend";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

export default function LandingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { showToast = false, toastMessage = '' } = route.params || {};

    const [fontsLoaded] = useFonts({
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_600SemiBold,
    });

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

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.landingImg} source={require('../assets/images/GradLohLanding.png')} />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.registerPressable} onPress={() => navigation.push('RegisterScreen')}>
                    <Image style={styles.emailIcon} source={require('../assets/images/emailicon.png')} />
                    <Text style={styles.registerText}>Sign up with email</Text>
                </Pressable>
                <Pressable style={styles.loginPressable} onPress={() => navigation.push('LoginScreen')}>
                    <Text style={styles.loginText}>Sign in</Text>
                </Pressable>
            </View>
            <CustomToast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "space-between"
    },
    imageContainer: {
        marginTop: 200,
        alignItems: "center"
    },
    buttonContainer: {
        padding: 36,
        backgroundColor: "#FFAF1D",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    landingImg: {
        width: 250,
        height: 250,
        resizeMode: 'contain'
    },
    loginPressable: {
        padding: 16,
        backgroundColor: "#EF7C00",
        borderRadius: 12,
    },
    loginText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontFamily: "Lexend_400Regular"
    },
    registerPressable: {
        padding: 16,
        backgroundColor: "#2C2C2E",
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    emailIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10
    },
    registerText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontFamily: "Lexend_400Regular"
    },
    toastContainer: {
        height: 60,
        width: '90%',
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
    warningToast: {
        backgroundColor: '#D00E17',
    },
    successToast: {
        backgroundColor: '#28a745', // Green color for success
    },
    textContainer: {
        flex: 1,
    },
    toastText1: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    toastText2: {
        fontSize: 14,
        color: 'white',
        marginBottom: 5
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
