
import { View, Text, StyleSheet, Image, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProfileSetUpOneScreen() {

    const navigation = useNavigation();

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);


    const data = [
        { label: '2022/2023', value: '2022/2023' },
        { label: '2023/2024', value: '2023/2024' },
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
                    *Please enter your matriculation year
                </Text>

                <Dropdown 
                    style={styles.dropdown} 
                    data={data} 
                    value={value} 
                    labelField="label" 
                    valueField="value" 
                    placeholder="Select AY" 
                    placeholderStyle={styles.dropdownPlaceholder}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                />

            </View>
            <Pressable style={styles.nextPressable} onPress={() => navigation.push('ProfileSetUpTwoScreen')}>
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
        fontSize: 40,
        marginBottom: 24
    },
    matricText: {
        fontFamily: "Lexend_300Light",
        fontSize: 16,
        marginBottom: 24
    },
    dropdown: {
        borderBottomWidth: 1,
        borderBottomColor: "#CBCBCB",
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