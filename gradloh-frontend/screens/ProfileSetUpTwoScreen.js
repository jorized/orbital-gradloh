
import { View, Text, StyleSheet, Image, TextInput, Pressable, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Dropdown } from 'react-native-element-dropdown';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CheckBoxWithLabel from "../components/CheckBoxWithLabel";
export default function ProfileSetUpTwoScreen() {

    const navigation = useNavigation();

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [isSecondMajor, setSecondMajor] = useState(false);
    const [isMinor, setMinor] = useState(false);

    const data = [
        { label: 'Arts and Social Sciences (FASS)', value: 'Arts and Social Sciences (FASS)' },
        { label: 'Business (SOB)', value: 'Business (SOB)' },
        { label: 'Computing (SOC)', value: 'Computing (SOC)' },
        { label: 'Design and Engineering (CDE)', value: 'Design and Engineering (CDE)' },
        { label: 'Science (FOS)', value: 'Science (FOS)' },
      ];

    const [fontsLoaded] = useFonts({
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_600SemiBold,
        Lexend_700Bold
    });

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>

            <View style = {styles.form}>
                <Text style={styles.profileSetUpTitle}>
                    Profile Setup
                </Text>
                <Text style={styles.matricText}>
                    *Please select your faculty
                </Text>

                <Dropdown 
                    style={styles.dropdownOne} 
                    data={data} 
                    value={value} 
                    labelField="label" 
                    valueField="value" 
                    placeholder="Select faculty" 
                    placeholderStyle={styles.dropdownPlaceholder}
                    onChange={item => {
                        console.log("HI");
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                />

                <Text style={styles.matricText}>
                    *Please select your major
                </Text>

                <Dropdown 
                    style={styles.dropdownTwo} 
                    data={data} 
                    value={value} 
                    labelField="label" 
                    valueField="value" 
                    placeholder="Select major" 
                    placeholderStyle={styles.dropdownPlaceholder}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                />

                <Text style={styles.matricText}>
                    (Optional) Please select all that apply :
                </Text>
                <Text style={styles.optionalText}>
                    I am currently taking a...
                </Text>

                <CheckBoxWithLabel
                    label="Second major"
                    value={isSecondMajor}
                    onValueChange={setSecondMajor}
                />
                <CheckBoxWithLabel
                    label="Minor"
                    value={isMinor}
                    onValueChange={setMinor}
                />

            </View>
            <Pressable style={styles.nextPressable} onPress={() => navigation.push('ProfileSetUpThreeScreen')}>
                    <Text style={styles.nextText}>Next</Text>
            </Pressable>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 36,
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between"
    },
    profileSetUpTitle: {
        fontFamily: "Lexend_600SemiBold",
        color: "#2C2C2E",
        fontSize: 40,
        marginBottom: 24
    },
    matricText: {
        fontFamily: "Lexend_300Light",
        fontSize: 16,
        marginBottom: 24
    },
    optionalText: {
        fontFamily: "Lexend_300Light",
        fontSize: 14,
        marginBottom: 24
    },
    dropdownOne: {
        borderBottomWidth: 1,
        borderBottomColor: "#CBCBCB",
        marginBottom: 24
    },
    dropdownTwo: {
        borderBottomWidth: 1,
        borderBottomColor: "#CBCBCB",
        marginBottom: 24
    },
    dropdownPlaceholder: {
        color: "#CBCBCB"
    },
    nextPressable: {
        padding: 16,
        backgroundColor: "#EF7C00",
        borderRadius: 12
    },
    nextText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontFamily: "Lexend_400Regular"
    }
})