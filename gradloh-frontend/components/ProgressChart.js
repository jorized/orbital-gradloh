import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AxiosContext } from '../contexts/AxiosContext';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';
import { Svg, Defs, LinearGradient, Stop } from 'react-native-svg';
import { VictoryAnimation, VictoryLabel, VictoryPie } from 'victory-native';
import ThemeContext from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProgressChart(props) {
  const theme = useContext(ThemeContext);
  const publicAxios = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;
  const { toggleSheet, accent } = props;

  const [state, setState] = useState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
  const [stats, setStats] = useState(null);



  useEffect(() => {

    publicAxios.authAxios.get('/userprogressdetails', {
      params: { email: email }
    })
      .then(response => {
        const totalMods = response.data.totalGe + response.data.totalCore;
        const totalModsCompleted = response.data.totalGeCompleted + response.data.totalCoreCompleted;
        const completedModsPercentage = (totalModsCompleted / totalMods) * 100;
        const newData = [{ x: 1, y: completedModsPercentage }, { x: 2, y: 100 - completedModsPercentage }];

        setState({ data: newData, percent: completedModsPercentage });
        setStats(response.data);

      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
      return () => {
        setState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
      };
  }, []);

  useFocusEffect(
    useCallback(() => {

      publicAxios.authAxios.get('/userprogressdetails', {
        params: { email: email }
      })
        .then(response => {
          const totalMods = response.data.totalGe + response.data.totalCore;
          const totalModsCompleted = response.data.totalGeCompleted + response.data.totalCoreCompleted;
          const completedModsPercentage = (totalModsCompleted / totalMods) * 100;
          const newData = [{ x: 1, y: completedModsPercentage }, { x: 2, y: 100 - completedModsPercentage }];

          setState({ data: newData, percent: completedModsPercentage });
          setStats(response.data);

        })
        .catch(error => {
          console.error("Error fetching data: ", error);
        });

      return () => {
        setState({ data: [{ x: 1, y: 0 }, { x: 2, y: 100 }], percent: 0 });
      };
    }, [])
  );


  return (
        
        <TouchableOpacity onPress={toggleSheet} style={styles.chartContainer}>
          <Svg viewBox="0 0 400 400" width="100%" height="100%">
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
                data: { fill: "lightgray" }
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
                    fill: ({ datum }) => {
                      return datum.x === 1 ? "url(#grad)" : "transparent";
                    }
                  }
                }}
              />
            <VictoryAnimation duration={1000} data={state}>
              {(newProps) => {
                return (
                  <>
                    <VictoryLabel
                      textAnchor="middle"
                      verticalAnchor="middle"
                      x={200}
                      y={200}
                      text={`${Math.round(newProps.percent)}%`}
                      style={[
                        { fill: theme.percentageLabel, fontSize: 45 },
                      ]}
                    />
                    <VictoryLabel
                      textAnchor="middle"
                      verticalAnchor="middle"
                      x={200}
                      y={380}
                      text={`Overall progress as of ${new Date().toLocaleDateString()}`}
                      style={[
                        { fill: theme.percentageLabel, fontSize: 16, fontStyle: 'italic', fontFamily: '' },
                      ]}
                    />
                  </>
                );
              }}
            </VictoryAnimation>
          </Svg>
        </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});
