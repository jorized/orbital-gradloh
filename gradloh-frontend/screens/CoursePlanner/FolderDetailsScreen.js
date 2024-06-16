import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming, interpolate } from "react-native-reanimated";
import DrawerHeader from "../../components/Drawer/DrawerHeader";
import AnimatedDrawerHeader from "../../components/Drawer/AnimatedDrawerHeader";
import Hamburger from "../../components/Drawer/Hamburger";
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton } from "@react-navigation/elements";
import ThemeContext from "../../contexts/ThemeContext";
import ListOfModules from '../../data/ListOfModules2324.json';
import * as SecureStore from 'expo-secure-store';
import { AxiosContext } from "../../contexts/AxiosContext";
import { EventRegister } from "react-native-event-listeners";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

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

const RenderItem = ({ item, listItemStyle, isFocused }) => {
  const translateX = useSharedValue(0);
  const maxSwipe = -100; // Maximum swipe distance

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Math.max(maxSwipe, ctx.startX + event.translationX);
    },
    onEnd: () => {
      if (translateX.value > maxSwipe) {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [maxSwipe, 0], [1, 0]);
    return {
      opacity,
    };
  });

  const truncatedDescription = truncateDescription(item.description);

  return (
    <View style={{ position: 'relative' }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity>
            <Animated.View style={[styles.flatListItemStyle, listItemStyle]}>
              <View style={styles.itemHeader}>
                <Text style={styles.moduleNameAndMC}>{item.moduleCode} ({item.moduleCredit}MC) </Text>
                <Text style={styles.faculty}>{item.faculty}</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.moduleDescription}>{truncatedDescription}</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.rubbishBinIcon, iconStyle]}>
        <Ionicons name="trash-outline" size={32} color="red" />
      </Animated.View>
    </View>
  );
};

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
  const [isFocused, setIsFocused] = useState(false);

  const listItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: listItemX.value }]
    };
  });

  const animatedPlusBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: animatedPlus.value }]
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }]
    };
  });

  const optionStyleOne = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: optionValueOne.value }]
    };
  });

  const optionStyleTwo = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: optionValueTwo.value }]
    };
  });

  const optionStyleThree = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: optionValueThree.value }]
    };
  });

  const getSubText = (headerName) => {
    const year = headerName.match(/Y(\d)/)[1];
    const semester = headerName.match(/S(\d)/)[1];
    return `Here is your list of modules for Year ${year} Semester ${semester}`;
  };

  const handleFloatingButton = () => {
    if (animatedPlus.value == '-45deg') {
      animatedPlus.value = withTiming('0deg', { duration: 300 });
      scaleValue.value = withTiming(1, { duration: 500 });

      optionValueOne.value = withTiming(0, { duration: 300 });
      optionValueTwo.value = withTiming(0, { duration: 300 });
      optionValueThree.value = withTiming(0, { duration: 300 });
    } else {
      animatedPlus.value = withTiming('-45deg', { duration: 300 });
      scaleValue.value = withTiming(0, { duration: 500 });

      optionValueOne.value = withTiming(170, { duration: 500 });
      optionValueTwo.value = withTiming(210, { duration: 500 });
      optionValueThree.value = withTiming(250, { duration: 500 });
    }
  };

  const handleAddModules = () => {
    // If folder is less than 8 
    if (moduleDetails.length < 8) {
      navigation.navigate('ModulesScreen', { headerName: "Modules", semIndex: semIndex, folderName: headerName });
    } else {
      Alert.alert("You can only add up to 8 modules in a");
    }
  };

  const fetchAndAnimate = () => {
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
      listItemX.value = withTiming(0, { duration: 1200 });
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      // Reset all shared values to their initial states
      listItemX.value = -Dimensions.get("window").width - 40;
      animatedPlus.value = '-45deg';
      scaleValue.value = 0;
      optionValueOne.value = 170;
      optionValueTwo.value = 210;
      optionValueThree.value = 250;
        
  
      fetchAndAnimate();
  
      const listener = EventRegister.addEventListener('folderInserted', (data) => {
        fetchAndAnimate(); // Re-fetch data or update state as needed
      });
  
      return () => {
        EventRegister.removeEventListener(listener);
      };
    }, [])
  );
  
  


  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <AnimatedDrawerHeader />
      <View style={styles.headerContainer}>
        <View style={styles.headerFlexContainer}>
          <HeaderBackButton
            style={styles.headerbackBtnStyle}
            onPress={() => navigation.goBack()}
            tintColor={theme.reverseColor}
            labelVisible={false}
          />
          <Text style={[styles.titleText, { color: theme.reverseColor }]}>{headerName}</Text>
        </View>
        <View style={styles.subTextContainer}>
          <Text style={[styles.headerSubText, { color: theme.reverseColor }]}>{getSubText(headerName)}</Text>
        </View>
        <FlatList
          data={moduleDetails}
          renderItem={({ item }) => <RenderItem item={item} listItemStyle={listItemStyle} />}
          keyExtractor={(item) => item.moduleCode}
        />
      </View>
      <Animated.View style={[styles.floatingButtonBg, scaleStyle, { backgroundColor: theme.floatingButtonBgColor }]}></Animated.View>

      <TouchableOpacity style={[styles.floatingButton
, { backgroundColor: theme.hamburgerColor }]} onPress={handleFloatingButton}>
<TouchableOpacity>
  <Animated.View style={[styles.bgButtonOne, optionStyleOne]}></Animated.View>
</TouchableOpacity>
<TouchableOpacity>
  <Animated.View style={[styles.bgButtonTwo, optionStyleTwo]}>
    <View style={styles.editButtonContainer}>
      <Ionicons name="pencil" size={28} color={"black"} />
      <Text style={styles.editFolderText}>Edit folder</Text>
    </View>
  </Animated.View>
</TouchableOpacity>
<TouchableOpacity onPress={handleAddModules}>
  <Animated.View style={[styles.bgButtonThree, optionStyleThree]}>
    <View style={styles.addButtonContainer}>
      <Ionicons name="add" size={34} color={"black"} />
      <Text style={styles.addModuleText}>Add modules</Text>
    </View>
  </Animated.View>
</TouchableOpacity>
<Animated.View style={animatedPlusBtnStyle}>
  <Ionicons name="close-outline" size={30} color={theme.reverseColor} />
</Animated.View>
</TouchableOpacity>
</View>
);
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
color: "white",
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
rubbishBinIcon: {
position: 'absolute',
right: 50,
top: '50%',
transform: [{ translateY: -10 }], // half the height of the icon to center it
},
floatingButton: {
width: 70,
height: 70,
borderRadius: 40,
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
},
bgButtonOne: {
width: 150,
height: 60,
borderRadius: 30,
backgroundColor: "white",
position: "absolute",
bottom: 240,
right: -50
},
bgButtonTwo: {
width: 190,
height: 60,
borderRadius: 30,
backgroundColor: "white",
position: "absolute",
bottom: 150,
right: -50
},
bgButtonThree: {
width: 230,
height: 60,
borderRadius: 30,
backgroundColor: "white",
position: "absolute",
bottom: 60,
right: -50
},
addButtonContainer: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingVertical: 14,
paddingHorizontal: 34
},
addModuleText: {
fontSize: 20
},
editButtonContainer: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingVertical: 14,
paddingHorizontal: 32
},
editFolderText: {
fontSize: 20
}
});
