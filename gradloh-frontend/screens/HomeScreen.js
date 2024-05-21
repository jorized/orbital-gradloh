import React, { useContext, useEffect } from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { AxiosContext } from '../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {

  const axiosContext = useContext(AxiosContext);
  const authContext = useContext(AuthContext);

  const test = SecureStore.getItem("token");

    return (
        <View style={styles.container}>
            <Text>Welcome to Home! {test}</Text>
            <Button title="Logout" onPress={() => authContext.logout()} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

