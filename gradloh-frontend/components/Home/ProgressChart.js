import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Pressable, ActivityIndicator, Text, Button, Platform } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AxiosContext } from '../../contexts/AxiosContext';
import { AuthContext } from '../../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Svg, Defs, LinearGradient, Stop } from 'react-native-svg';
import { VictoryAnimation, VictoryLabel, VictoryPie } from 'victory-native';
import ThemeContext from '../../contexts/ThemeContext';
import { useFonts } from 'expo-font';
import { Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { Lexend_300Light, Lexend_600SemiBold, Lexend_700Bold } from '@expo-google-fonts/lexend';
import Tooltip from 'react-native-walkthrough-tooltip';
import TutorialToolTip from '../TutorialToolTip';

const { width } = Dimensions.get('window');

export default function ProgressChart(props) {
  const theme = useContext(ThemeContext);
  const publicAxios = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;
  const { toggleSheet, accent, clickedProgressChartTutorial } = props;
  const navigation = useNavigation();
  const route = useRoute();

  const [state, setState] = useState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
  const [stats, setStats] = useState(null);
  const [showTip, setTip] = useState(false);

  const [fontsLoaded] = useFonts({
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Lexend_600SemiBold,
    Lexend_300Light,
    Lexend_700Bold
  });

  const handleToolTip = () => {
    setTip(false);
    navigation.navigate('Dashboard', {clickedProgressChartTutorial: false, clickedStatusTutorial: true, clickedBottomSheetTutorial: false})
  }

  useEffect(() => {
    if (clickedProgressChartTutorial) {
      setTip(clickedProgressChartTutorial);
    } 
    setTip(false);
    publicAxios.authAxios.get('/userprogressdetails', {
      params: { email: email }
    })
      .then(response => {
        const completedModsPercentage = response.data.completedModulesPercentage;
        const newData = [{ x: 1, y: completedModsPercentage }, { x: 2, y: 100 - completedModsPercentage }];

        setState({ data: newData, percent: completedModsPercentage });
        setStats(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
    return () => {
      setState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
    };
  }, [clickedProgressChartTutorial, route.params?.refreshChart])


  useFocusEffect(

    useCallback(() => {
      if (clickedProgressChartTutorial) {
        setTip(clickedProgressChartTutorial);
      } 
      setTip(false);
      
      publicAxios.authAxios.get('/userprogressdetails', {
        params: { email: email }
      })
        .then(response => {
          const completedModsPercentage = response.data.completedModulesPercentage;
          const newData = [{ x: 1, y: completedModsPercentage }, { x: 2, y: 100 - completedModsPercentage }];

          setState({ data: newData, percent: completedModsPercentage });
          setStats(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      return () => {
        setState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
      };
    }, [clickedProgressChartTutorial, route.params?.refreshChart])
  );

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (

      <Svg viewBox="0 0 400 400" style={ [styles.pieContainer ] } >
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={accent[0]} stopOpacity="1" />
            <Stop offset="100%" stopColor={accent[1]} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <VictoryPie
          standalone={false}
          width={400}
          height={400}
          data={[{ x: 1, y: 1 }]}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: { fill: "lightgray" },
          }}
        />
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={400}
          height={400}
          data={state.data}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => (datum.x === 1 ? "url(#grad)" : "transparent"),
            },
          }}
          events = {[{
            target: "data",
            eventHandlers: {
              onPressIn: () => {
                return [
                  {
                    target: 'data',
                    mutation: dataProps => {
                        toggleSheet()
                          return {}
                    }
                  }
                ]
              }
            }
          }]}
        />
        <VictoryAnimation duration={1000} data={state}>
          {(newProps) => (
            <>
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={200}
                y={200}
                text={`${Math.round(newProps.percent)}%`}
                style={[
                  { fill: theme.color, fontSize: 45, fontFamily: 'Lexend_700Bold' },
                ]}
              />
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={200}
                y={390}
                text={`Overall progress as of ${new Date().toLocaleDateString()}`}
                style={[
                  { fill: theme.color, fontSize: 18, fontStyle: 'italic', fontFamily: 'Lexend_300Light' },
                ]}
              />
            </>
          )}
        </VictoryAnimation>
      </Svg>

  );
}

const styles = StyleSheet.create({


  pieContainer: {
    height: 340,
		top: -20,

  }

});
