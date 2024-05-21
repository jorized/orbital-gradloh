
import { View, Text, StyleSheet, Image, Button, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold } from "@expo-google-fonts/lexend";
import { useNavigation } from "@react-navigation/native";

export default function LandingScreen() {

    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_600SemiBold,
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style ={styles.landingImg} source={require('../assets/images/gradlohlanding-removebg-preview.png')}/>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.registerPressable} onPress={() => navigation.push('RegisterScreen')}>
                    <Image style = {styles.emailIcon} source={require('../assets/images/emailicon.png')}/>
                    <Text style={styles.registerText}>Sign up with email</Text>
                </Pressable>
                <Pressable style={styles.loginPressable} onPress={() => navigation.push('LoginScreen')}>
                    <Text style={styles.loginText}>Sign in</Text>
                </Pressable>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "space-between"
    },
    buttonContainer: {
        padding: 36,
        backgroundColor: "#FFAF1D",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    landingImg: {
        marginTop: 200,
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: "center"
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
    }


})