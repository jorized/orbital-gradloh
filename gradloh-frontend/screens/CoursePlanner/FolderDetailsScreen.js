import { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import DrawerHeader from "../../components/Drawer/DrawerHeader";
import AnimatedDrawerHeader from "../../components/Drawer/AnimatedDrawerHeader";
import Hamburger from "../../components/Drawer/Hamburger";
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from "@react-navigation/elements";
import ThemeContext from "../../contexts/ThemeContext";
import ListOfModules from '../../data/ListOfModules2324.json';
import * as SecureStore from 'expo-secure-store';
import { AxiosContext } from "../../contexts/AxiosContext";

export default function FolderDetailsScreen({ route, navigation }) {

    const { headerName, semIndex } = route.params;

    const userProfileDetails = SecureStore.getItem('userprofiledetails');
    const email = JSON.parse(userProfileDetails).email;

    const publicAxios = useContext(AxiosContext);
    const theme = useContext(ThemeContext);

    const listItemX = useSharedValue(-Dimensions.get("window").width - 40);
    const animatedPlus = useSharedValue('-45deg');
    const scaleValue = useSharedValue(0);

    const optionValueOne = useSharedValue(170);
    const optionValueTwo = useSharedValue(210);
    const optionValueThree = useSharedValue(250);

    const [loading, setLoading] = useState(true);
    const [moduleDetails, setModuleDetails] = useState([]);

    const listItemStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: listItemX.value}]
        }
    })

    const animatedPlusBtnStyle = useAnimatedStyle(() => {
        return {
            transform: [{rotate: animatedPlus.value}]
        }
    })

    const scaleStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scaleValue.value}]
        }
    })

    const optionStyleOne = useAnimatedStyle(() => {
        return {
            transform: [{translateX: optionValueOne.value}]
        }
    })

    const optionStyleTwo = useAnimatedStyle(() => {
        return {
            transform: [{translateX: optionValueTwo.value}]
        }
    })

    const optionStyleThree = useAnimatedStyle(() => {
        return {
            transform: [{translateX: optionValueThree.value}]
        }
    })

    const getSubText = (headerName) => {
        const year = headerName.match(/Y(\d)/)[1];
        const semester = headerName.match(/S(\d)/)[1];
        return `Here is your list of modules for Year ${year} Semester ${semester}`;
    };

    const handleFloatingButton = () => {
        if (animatedPlus.value == '-45deg') {
            animatedPlus.value = withTiming('0deg', {duration: 300});
            scaleValue.value = withTiming(1, {duration: 500})

            optionValueOne.value = withTiming(0, {duration: 300})
            optionValueTwo.value = withTiming(0, {duration: 300})
            optionValueThree.value = withTiming(0, {duration: 300})
        } else {
            animatedPlus.value = withTiming('-45deg', {duration: 300})
            scaleValue.value = withTiming(0, {duration: 500})

            optionValueOne.value = withTiming(170, {duration: 500})
            optionValueTwo.value = withTiming(210, {duration: 500})
            optionValueThree.value = withTiming(250, {duration: 500})
        }
    }

    const MAX_DESCRIPTION_LENGTH = 200; 

    const truncateDescription = (description) => {
        if (description.length > MAX_DESCRIPTION_LENGTH) {
            const truncatedText = description.substring(0, MAX_DESCRIPTION_LENGTH);
            return (
                <Text>
                    {truncatedText}
                    <Text style={{ color: '#2196F3' }}>... see more</Text>
                </Text>
            );
        }
        return description;
    };

    useEffect(() => {
        publicAxios.authAxios.get('/specificfolderdetails', {
            params: { email: email, folderName: semIndex }
        }).then(response => {
            const modsInSpecificFolder = response.data.modsInSpecificFolder;
            // Compare and get the details of the modules
            const details = modsInSpecificFolder.map(modCode => {
                return ListOfModules.find(module => module.moduleCode === modCode);
            });
            setModuleDetails(details);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        }).then(() => {
            listItemX.value = withTiming(0, {duration: 1200})
        })

    }, [])


    return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <AnimatedDrawerHeader/>
            <View style = {styles.headerContainer}>
                <View style = {styles.headerFlexContainer}>
                    <HeaderBackButton
                                    style={styles.headerbackBtnStyle}
                                    onPress={() => navigation.goBack()}
                                    tintColor={theme.reverseColor}
                                    labelVisible={false}
                                />
                    <Text style={[styles.titleText, {color : theme.reverseColor}]}>{headerName}</Text>
                </View>
                <View style = {styles.subTextContainer}>
                    <Text style = {styles.headerSubText}>{getSubText(headerName)}</Text>
                </View>
                <FlatList data = {moduleDetails} renderItem={({item}) => {
                    const truncatedDescription = truncateDescription(item.description);
                    return (
                        <TouchableOpacity>
                            <Animated.View style = {[styles.flatListItemStyle, listItemStyle]}>
                                <View style = {styles.itemHeader}>
                                    <Text style = {styles.moduleNameAndMC}>{item.moduleCode} ({item.moduleCredit}MC) </Text>
                                    <Text style = {styles.faculty}>{item.faculty}</Text>
                                </View>
                                <View style = {styles.itemContent}>
                                    <Text style = {styles.moduleDescription}>{truncatedDescription}</Text>
                                </View>
                            </Animated.View>
                        </TouchableOpacity>
                    )
                }}/>
            </View>
            <Animated.View style = {[styles.floatingButtonBg, scaleStyle]}></Animated.View>

            <TouchableOpacity style = {styles.floatingButton} onPress={handleFloatingButton}>
                <TouchableOpacity>
                    <Animated.View style = {[styles.bgButtonOne, optionStyleOne]}></Animated.View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Animated.View style = {[styles.bgButtonTwo, optionStyleTwo]}></Animated.View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Animated.View style = {[styles.bgButtonThree, optionStyleThree]}></Animated.View>
                </TouchableOpacity>
                <Animated.View style={animatedPlusBtnStyle} >
                    <Ionicons name="close-outline" size={30} color="white"/>
                </Animated.View>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    headerContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },

    headerFlexContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 5,
        marginTop: 50,
    },
    headerbackBtnStyle: {
        marginLeft: 10
    },
    titleText: {
        fontSize: 26,
        fontFamily: "Lexend_600SemiBold",
        marginLeft: 10,
    },
    subTextContainer: {
        marginTop: 10,
        paddingHorizontal: 20
    },
    headerSubText: {
        fontSize: 26,
        textAlign: "center",
        color : "white",
        fontFamily: "Lexend_400Regular",
    },
    flatListItemStyle: {
        width: Dimensions.get("window").width - 40,
        marginTop: 20,
        backgroundColor: "#d9d9d9",
        alignSelf: "center",
        borderRadius: 20,
        padding: 20
    },
    itemHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    moduleNameAndMC: {
        fontSize: 18,
        fontFamily: "Lexend_600SemiBold",
    },
    faculty: {
        fontSize: 16,
        fontFamily: "Lexend_600SemiBold",
    },
    moduleDescription: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: "Lexend_400Regular",
    },
    floatingButton: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: "#EF7C00",
        position: "absolute",
        right: 20,
        bottom: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    floatingButtonBg: {
        width: 1000,
        height: 1000,
        borderRadius: 500,
        position: "absolute",
        bottom: -500,
        right: -600,
        backgroundColor: "rgba(239, 124, 0, .5)"
    },
    bgButtonOne: {
        width: 160,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        position: "absolute",
        bottom: 240,
        right: -50
    },
    bgButtonTwo: {
        width: 200,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        position: "absolute",
        bottom: 150,
        right: -50
    },
    bgButtonThree: {
        width: 240,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        position: "absolute",
        bottom: 60,
        right: -50
    },


  });