import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, TouchableOpacity, Button } from 'react-native';
import ThemeContext from '../theme/ThemeContext';
import { useFonts } from 'expo-font';
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import AnimatedNumbers from 'react-native-animated-numbers';
import { AxiosContext } from '../contexts/AxiosContext';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const CustomBottomSheet = ({ isVisible }) => {
  const [values, setValues] = useState({
    coreCompleted: 0,
    totalCore: 0,
    geCompleted: 0,
    totalGe: 0,
  });

  const [progressWidths, setProgressWidths] = useState({
    core: new Animated.Value(0),
    ge: new Animated.Value(0),
  });

  const theme = useContext(ThemeContext);
  const translateY = useRef(new Animated.Value(height)).current;
  const authContext = useContext(AuthContext);
  const publicAxios = useContext(AxiosContext);
  const [email, setEmail] = useState(null);

  const [fontsLoaded] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    const fetchUserProfileDetails = async () => {
      const userProfileDetails = await SecureStore.getItemAsync('userprofiledetails');
      if (userProfileDetails) {
        setEmail(JSON.parse(userProfileDetails).email);
      }
    };

    fetchUserProfileDetails();
  }, []);

  const getProgressDetails = async () => {
    if (email) {
      try {
        const response = await publicAxios.authAxios.get('/userprogressdetails', {
          params: { email: email }
        });
        animatedNumberEffect(response.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const animatedNumberEffect = (data) => {
    setValues({
      coreCompleted: data.totalCoreCompleted,
      totalCore: data.totalCore,
      geCompleted: data.totalGeCompleted,
      totalGe: data.totalGe,
    });

    Animated.timing(progressWidths.core, {
      toValue: (data.totalCoreCompleted / data.totalCore) * width * 0.9,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    Animated.timing(progressWidths.ge, {
      toValue: (data.totalGeCompleted / data.totalGe) * width * 0.9,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      getProgressDetails();
    } else {
      Animated.timing(translateY, {
        toValue: height * 0.4,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, email]);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Animated.View style={[styles.swipeUpView, { transform: [{ translateY }] }]}>
      <View style={[styles.content]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: theme.bottomSheetTitleColor }]}>Details</Text>
          <TouchableOpacity style={[styles.plusCircle, {backgroundColor: theme.color}]}>
            <Text style={[styles.plusText, {color: theme.backgroundColor}]}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={[styles.card, {backgroundColor: theme.bottomSheetCardColor}]}>
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={require('../assets/images/asterisk.png')} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: theme.bottomSheetTitleColor }]}>Core Mods Taken</Text>
              <View style={styles.detailsContainer}>
                <AnimatedNumbers animationDuration={3000} animateToNumber={values.coreCompleted} fontStyle={[styles.detailText, { color: theme.bottomSheetTitleColor }]} />
                <Text style={[styles.detailText, { color: theme.bottomSheetTitleColor }]}>/</Text>
                <AnimatedNumbers animationDuration={3000} animateToNumber={values.totalCore} fontStyle={[styles.detailText, { color: theme.bottomSheetTitleColor }]} />
              </View>
            </View>
            <Text style={[styles.percentage, { color: theme.bottomSheetTitleColor }]}>
              {((values.coreCompleted / values.totalCore) * 100).toFixed(0)}%
            </Text>
          </View>
          <View style={[styles.card, {backgroundColor: theme.bottomSheetCardColor}]}>
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={require('../assets/images/pillar.png')} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: theme.bottomSheetTitleColor }]}>GE Mods Taken</Text>
              <View style={styles.detailsContainer}>
                <AnimatedNumbers animationDuration={3000} animateToNumber={values.geCompleted} fontStyle={[styles.detailText, { color: theme.bottomSheetTitleColor }]} />
                <Text style={[styles.detailText, { color: theme.bottomSheetTitleColor }]}>/</Text>
                <AnimatedNumbers animationDuration={3000} animateToNumber={values.totalGe} fontStyle={[styles.detailText, { color: theme.bottomSheetTitleColor }]} />
              </View>
            </View>
            <Text style={[styles.percentage, { color: theme.bottomSheetTitleColor }]}>
              {((values.geCompleted / values.totalGe) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeUpView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginLeft: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  titleText: {
    fontFamily: "Quicksand_700Bold",
    fontSize: 34,
  },
  contentContainer: {
    margin: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailText: {
    fontFamily: "Lexend_300Light",
    fontSize: 16,
    marginRight: 5,
  },
  percentage: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
  },
  plusCircle: {
    width: 34,
    height: 34,
    borderRadius: 20,
    marginRight: 30
  },
  plusText: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    color: '#FFF',
    fontSize: 25,
  },
});

export default CustomBottomSheet;
