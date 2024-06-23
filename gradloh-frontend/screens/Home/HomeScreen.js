import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Button,
  Platform,
  Alert
} from 'react-native';
import ThemeContext from '../../contexts/ThemeContext';
import CustomBottomSheet from '../../components/Home/CustomBottomSheet';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import ProgressChart from '../../components/Home/ProgressChart';
import { BACKDROP_COLOR, GRADIENT_COLORS } from '../../misc/colors';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HEIGHT, OVERDRAG } from '../../misc/consts';
import AccentPicker from '../../components/Home/AccentPicker';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import DrawerHeader from '../../components/Drawer/DrawerHeader';
import Tooltip from 'react-native-walkthrough-tooltip';
import TutorialToolTip from '../../components/TutorialToolTip';
import { AxiosContext } from '../../contexts/AxiosContext';
import { LoadingContext } from '../../contexts/LoadingContext';
import { AuthContext } from '../../contexts/AuthContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen({ toggleTheme, headerName, route, refreshChart }) {

  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;

  const authContext = useContext(AuthContext);
  const publicAxios = useContext(AxiosContext);
  const { setIsLoading } = useContext(LoadingContext);
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState(
    GRADIENT_COLORS[0]
  );

  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showBFWGSTooltip, setBWGSTooltip] = useState(false);

  const offset = useSharedValue(0);

  useEffect(() => {
    if (authContext?.authState?.firstTimeUser) {
      authContext.setAuthState((prevState) => ({
        ...prevState,
        firstTimeUser: false
      }));
      Alert.alert(
        "Notice",
        "Welcome to GradLoh! Do you want to proceed with the basic tutorial?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => handleLoadSamplePlan()
          },
          { text: "Proceed", onPress: () => navigation.navigate("Dashboard", {startTutorial: true}) }
        ],
        { cancelable: false }
      );
    }

    if (route.params) {
        const { startTutorial, beforeWeGetStartedToolTip, cameFromOnboarding } = route.params;


        if (startTutorial) {
            setShowTooltip1(true);
        }

        if (beforeWeGetStartedToolTip) {
			setTimeout(() => {
				setBWGSTooltip(true);
			}, 100);
        }
    }

    const loadSelectedGradient = async () => {
        try {
            const storedGradient = await SecureStore.getItemAsync('selectedGradient');
            if (storedGradient) {
                setSelectedGradient(JSON.parse(storedGradient));
            }
        } catch (error) {
            console.error('Failed to load the selected gradient color', error);
        }
    };
    loadSelectedGradient();
}, [route.params]);


  const saveSelectedGradient = async (gradient) => {
    try {
      await SecureStore.setItemAsync(
        'selectedGradient',
        JSON.stringify(gradient)
      );
    } catch (error) {
      console.error('Failed to save the selected gradient color', error);
    }
  };

  const handleLoadSamplePlan = () => {
    Alert.alert(
      "Notice",
      "Do you want to load in the sample plan for your curriculum?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Get started", onPress: () => loadSamplePlan() }
      ],
      { cancelable: false }
    );
  }

  const loadSamplePlan = () => {
    setBWGSTooltip(false);
    setIsLoading(true);
    publicAxios.authAxios.post('/loadsampleplan', {
      email
    }).then((response) => {
      setIsLoading(false);
      Alert.alert(
        "Success",
        "Your sample plan has successfully been loaded",
        [
            {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Dashboard", {refreshChart: true});
                }
            }
        ]
    );
    }).catch((error) => {
      console.log("COMES " + error)
    });
  }


  const handlePick = (colorIndex) => {
    const selectedGradient = GRADIENT_COLORS[colorIndex];
    setSelectedGradient(selectedGradient);
    saveSelectedGradient(selectedGradient);
    toggleSheet();
  };

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }]
  }));

  const toggleSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

  const handleCloseToolTipTwo = () => {
	setShowTooltip2(false);
	navigation.navigate("FolderStack", {
        screen: 'FolderScreen',
        params: { startTutorial: true, headerName: "Semesters" }
      });
  }

  const handleCloseBWGSToolTip = () => {
	setBWGSTooltip(false);

  }


  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-OVERDRAG, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);
      return () => setIsVisible(false);
    }, [route.params])
  );

  return (
    <GestureHandlerRootView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <SafeAreaProvider>
        <DrawerHeader toggleTheme={toggleTheme} headerName={headerName}/>
		<Tooltip isVisible={showBFWGSTooltip ? true : false} placement="center" onClose={() => {}}
                    content = {
						<View style={styles.tooltipContainer}>
						<View style={styles.tooltipContent}>
							<Text style={[styles.title, {color : theme.hamburgerColor}]}>Before we get started</Text>
							<Text style={[styles.text, {color : theme.color}]}>And that's it for the basic tutorial. Now, before we get started, would you like to load in the sample study plan for your academic discipline? Note that this will reset your existing study plan, if you already have one.</Text>
							<View style = {styles.toolTipButtonContainer}>
							<TouchableOpacity style={[styles.button, {backgroundColor: theme.hamburgerColor}]} onPress={loadSamplePlan}>
								<Text style={[styles.buttonText, {color : theme.reverseColor}]}>Yes</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.button, {backgroundColor: theme.hamburgerColor}]} onPress={handleCloseBWGSToolTip}>
								<Text style={[styles.buttonText, {color : theme.reverseColor}]}>No I'm good</Text>
							</TouchableOpacity>
							</View>

						</View>
						<View style={styles.tooltipArrow} />
					</View>
                    }
    	></Tooltip>
        <Tooltip
		contentStyle={{width: "auto", height: "auto"}}
		animated
          isVisible={showTooltip1}
          content={
          <TutorialToolTip
            title="Progress Chart"
            text='This is where you can see your real-time graduation progress as of the current date, where it will continuously increase as you add more modules which satisfies your curriculum. You can also tap the pie to customise the color to suit your preference.'
            buttonText="Next"
            onPress={() => {setShowTooltip1(false); setShowTooltip2(true)}}
          />
          }
          placement="bottom"
          onClose={() => {}}
        >
          <ProgressChart
            toggleSheet={toggleSheet}
            accent={selectedGradient}
            refreshChart = {refreshChart}
          />
        </Tooltip>
		<Tooltip isVisible={showTooltip2} placement="center" onClose={() => {}}
			content = {
				<TutorialToolTip
					title="Progression Details"
					text='Below is where you can see your graduation preparedness, and determine if you are "On Track" or "At Risk". You can also view the different types of modules and their various progress.'
					buttonText="Next"
					onPress={handleCloseToolTipTwo}
			  />
			}
		>
		</Tooltip>
		<CustomBottomSheet/>
        {isOpen && (
          <>
            <AnimatedPressable
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.backdrop}
              onPress={toggleSheet}
              pointerEvents="auto"
            />
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[
                  styles.sheet,
                  translateY,
                  {
                    backgroundColor:
                      theme.gradientColorBottomSheet
                  }
                ]}
                entering={SlideInDown.springify().damping(15)}
                exiting={SlideOutDown}
              >
                <AccentPicker
                  onPick={handlePick}
                  selectedGradient={selectedGradient}
                />
              </Animated.View>
            </GestureDetector>
          </>
        )}
		<Tooltip childrenWrapperStyle={{flex: 1, height: 400}}>
        	<CustomBottomSheet/>
		</Tooltip>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sheet: {
    padding: 16,
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: -OVERDRAG * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1
  },
  gradient: {
    flex: 1,
  },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1
  },
  overallContainer: {
    borderWidth: 1
  },
  overallText: {
    textAlign: "center",
    fontSize: 18,
    fontStyle: "italic",
  },
  tooltipContainer: {
	position: 'relative',
	backgroundColor: 'white',
	borderRadius: 8,
	padding: 16,
},
title: {
	fontSize: 18,
	fontWeight: 'bold',
	marginBottom: 8,
},
text: {
	fontSize: 16,
	marginBottom: 16,
},
button: {
	borderRadius: 4,
	paddingVertical: 8,
	alignSelf: 'flex-end',  // Align button to the right
	padding: 10
},
buttonText: {
	fontSize: 16,
	fontWeight: 'bold',
},
tooltipArrow: {
	position: 'absolute',
	bottom: -10,
	left: '50%',
	marginLeft: -10,
	width: 0,
	height: 0,
	borderLeftWidth: 10,
	borderRightWidth: 10,
	borderBottomWidth: 10,
	borderStyle: 'solid',
	backgroundColor: 'transparent',
	borderLeftColor: 'transparent',
	borderRightColor: 'transparent',
	borderBottomColor: 'white',
},
toolTipButtonContainer: {
	flexDirection: "row",
	justifyContent: "flex-end",
	gap: 10
}
});
