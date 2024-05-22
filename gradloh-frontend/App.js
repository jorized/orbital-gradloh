import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import ProfileSetUpOneScreen from './screens/ProfileSetUpOneScreen';
import ProfileSetUpTwoScreen from './screens/ProfileSetUpTwoScreen';
import { useCallback, useContext, useState, useEffect } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import HomeScreen from './screens/HomeScreen';
import Spinner from './components/Spinner';
import * as SecureStore from 'expo-secure-store';
import { AxiosProvider } from './contexts/AxiosContext';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordConfirmationScreen from './screens/ResetPasswordConfirmationScreen';

const PublicStack = createStackNavigator();
const PrivateStack = createStackNavigator();

const PublicNavigator = () => (
  <PublicStack.Navigator>
    <PublicStack.Screen
      name="LandingScreen"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <PublicStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
    <PublicStack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
    <PublicStack.Screen
      name="ResetPasswordConfirmationScreen"
      component={ResetPasswordConfirmationScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
    <PublicStack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
    <PublicStack.Screen
      name="ProfileSetUpOneScreen"
      component={ProfileSetUpOneScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
    <PublicStack.Screen
      name="ProfileSetUpTwoScreen"
      component={ProfileSetUpTwoScreen}
      options={{
        header: ({ navigation }) => (
          <SafeAreaView style={styles.loginHeader}>
            <View style={styles.loginBackBtnContainer}>
              <HeaderBackButton onPress={() => navigation.goBack()} style={styles.loginBackBtn} tintColor="#EF7C00" labelVisible={false} />
            </View>
          </SafeAreaView>
        ),
      }}
    />
  </PublicStack.Navigator>
);

const PrivateNavigator = () => (
  <PrivateStack.Navigator>
    <PrivateStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </PrivateStack.Navigator>
);

const App = () => {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');

  const loadJWT = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync("token");
      const jwt = JSON.parse(value);

      authContext.setAuthState({
        accessToken: jwt.accessToken || null,
        refreshToken: jwt.refreshToken || null,
        authenticated: jwt.accessToken !== null,
      });
      
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`Secure Store Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return <Spinner />;
  }

  return (
      <NavigationContainer>
        {authContext?.authState?.authenticated ? <PrivateNavigator /> : <PublicNavigator />}
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loginHeader: {
    backgroundColor: "white",
    height: 100,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  loginBackBtnContainer: {
    padding: 24,
    marginTop: 50
  }
});

export default () => (
  <AuthProvider>
    <AxiosProvider>
        <App />
    </AxiosProvider>
  </AuthProvider>
);
