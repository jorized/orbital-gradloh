/* SCREENS*/
import LandingScreen from './screens/Auth/LandingScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import ResetPasswordConfirmationScreen from './screens/Auth/ResetPasswordConfirmationScreen';
import ProfileSetUpOneScreen from './screens/Auth/ProfileSetUpOneScreen';
import ProfileSetUpTwoScreen from './screens/Auth/ProfileSetUpTwoScreen';
import ProfileSetUpThreeScreen from './screens/Auth/ProfileSetUpThreeScreen';
import ProfileSetUpFourScreen from './screens/Auth/ProfileSetUpFourScreen';
import OnboardingScreen from './screens/Auth/OnboardingScreen';
import HomeScreen from './screens/Home/HomeScreen';
import FolderScreen from './screens/CoursePlanner/FolderScreen';
import FolderDetailsScreen from './screens/CoursePlanner/FolderDetailsScreen';
import ModulesScreen from './screens/CoursePlanner/ModulesScreen';

/* OTHERS */
import 'react-native-gesture-handler';
import { useCallback, useContext, useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import SplashScreen from './components/SplashScreen';
import Spinner from './components/Spinner';
import LogoutDrawerContent from './components/Drawer/LogoutDrawerContent';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import ThemeContext from './contexts/ThemeContext';
import Theme from './misc/Theme';
import { AxiosProvider } from './contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import { Entypo, Ionicons } from '@expo/vector-icons';
import ModuleDetailsScreen from './screens/CoursePlanner/ModuleDetailsScreen';




const PublicStack = createStackNavigator();
const FolderStack = createStackNavigator();
const PrivateDrawer = createDrawerNavigator();


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
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ForgotPasswordScreen"
			component={ForgotPasswordScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ResetPasswordConfirmationScreen"
			component={ResetPasswordConfirmationScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="RegisterScreen"
			component={RegisterScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ProfileSetUpOneScreen"
			component={ProfileSetUpOneScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ProfileSetUpTwoScreen"
			component={ProfileSetUpTwoScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ProfileSetUpThreeScreen"
			component={ProfileSetUpThreeScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="ProfileSetUpFourScreen"
			component={ProfileSetUpFourScreen}
			options={{
				header: ({ navigation }) => (
					<SafeAreaView style={styles.loginHeader}>
						<View style={styles.loginBackBtnContainer}>
							<HeaderBackButton
								onPress={() => navigation.goBack()}
								style={styles.loginBackBtn}
								tintColor="#EF7C00"
								labelVisible={false}
							/>
						</View>
					</SafeAreaView>
				)
			}}
		/>
		<PublicStack.Screen
			name="OnboardingScreen"
			component={OnboardingScreen}
			options={{
				gestureEnabled: false,
				headerShown: false
			}}
		/>
	</PublicStack.Navigator>
);

const PrivateNavigator = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [userProfileDetails, setUserProfileDetails] = useState({ nickname: '' });
  
	useEffect(() => {
	  const getUserProfileDetails = async () => {
		const profileDetails = await SecureStore.getItemAsync('userprofiledetails');
		if (profileDetails) {
		  setUserProfileDetails(JSON.parse(profileDetails));
		}
	  };
	  getUserProfileDetails();
	}, []);
  
	const toggleTheme = async () => {
	  setIsDarkMode(!isDarkMode);
	  EventRegister.emit('ChangeTheme', !isDarkMode);
	  await SecureStore.setItemAsync('isDarkMode', JSON.stringify(isDarkMode));
	};
  
	return (
	  <ThemeContext.Provider value={isDarkMode ? Theme.dark : Theme.light}>
		<PrivateDrawer.Navigator
		  drawerContent={(props) => <LogoutDrawerContent {...props} userNickname={userProfileDetails.nickname} />}
		  screenOptions={({ route, navigation }) => ({
			headerShown: false,
			drawerActiveTintColor: isDarkMode ? "#FFB67E" : "#EF7C00",
		  })}
		>
		  <PrivateDrawer.Screen
			name="Dashboard"
			options={{ 
				swipeEnabled: true, 
				drawerIcon: ({ focused, size }) => (
				  isDarkMode ?
				  <Ionicons name="home" size={size} color={focused ? '#FFB67E' : '#FFB67E'} /> :
				  <Ionicons name="home" size={size} color={focused ? '#EF7C00' : '#EF7C00'} />
				),
				drawerLabel: ({ focused }) => (
				  isDarkMode ?
				  <Text style={{ color: focused ? '#FFB67E' : '' }}>Dashboard</Text> :
				  <Text style={{ color: focused ? '#EF7C00' : '#EF7C00' }}>Dashboard</Text>
				)
			}}
		  >
			{props => <HomeScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} headerName={"Dashboard"}/>}
		  </PrivateDrawer.Screen>
		  <PrivateDrawer.Screen
			name="FolderStack"
			component={FolderStackNavigator}
			options={{ 
			  swipeEnabled: true, 
			  drawerIcon: ({ focused, size }) => (
				isDarkMode ? 
				<Entypo name="folder" size={size} color={focused ? '#FFB67E' : '#FFB67E'} /> : 
				<Entypo name="folder" size={size} color={focused ? '#EF7C00' : '#EF7C00'} />
			  ),
			  drawerLabel: ({ focused }) => (
				isDarkMode ?
				<Text style={{ color: focused ? '#FFB67E' : '#FFB67E' }}>Semesters</Text> :
				<Text style={{ color: focused ? '#EF7C00' : '#EF7C00' }}>Semesters</Text>
			  )
			}}
		  />
		</PrivateDrawer.Navigator>
	  </ThemeContext.Provider>
	);
};
const FolderStackNavigator = () => (
	<FolderStack.Navigator>
		<FolderStack.Screen name="FolderScreen" options = {{headerShown: false}}>
			{props => <FolderScreen {...props} headerName={"Semesters"} />}
		</FolderStack.Screen>
		<FolderStack.Screen name="FolderDetailsScreen" component = {FolderDetailsScreen} options = {{headerShown: false}}/>
		<FolderStack.Screen name="ModulesScreen" component = {ModulesScreen} options = {{headerShown: false}}/>
		<FolderStack.Screen name="ModuleDetailsScreen" component = {ModuleDetailsScreen} options = {{headerShown: false}}/>
	</FolderStack.Navigator>
);

const App = () => {
	
	const authContext = useContext(AuthContext);
	const [status, setStatus] = useState('loading');
	const [showSplash, setShowSplash] = useState(true);
	const [darkMode , setDarkMode] = useState(false);

	const loadJWT = useCallback(async () => {
		try {
			const value = await SecureStore.getItemAsync('token');
			const jwt = JSON.parse(value);

			authContext.setAuthState({
				accessToken: jwt.accessToken || null,
				refreshToken: jwt.refreshToken || null,
				authenticated: jwt.accessToken !== null
			});

			setStatus('success');
		} catch (error) {
			setStatus('error');
			console.log(`Secure Store Error: ${error.message}`);
			authContext.setAuthState({
				accessToken: null,
				refreshToken: null,
				authenticated: false
			});
		}
	}, []);

	useEffect(() => {
		loadJWT();
		const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
			setDarkMode(data)
		})
		return () => {
			EventRegister.removeAllListeners(listener);
		}
	}, [loadJWT, darkMode]);

	if (showSplash) {
		return <SplashScreen onAnimationFinish={() => setShowSplash(false)} />;
	}

	if (status === 'loading') {
		return <Spinner />;
	}

	return (
		<NavigationContainer>
		  {authContext?.authState?.authenticated ? (
			<PrivateNavigator />
		  ) : (
			<PublicNavigator />
		  )}
		</NavigationContainer>
	  );
};

const styles = StyleSheet.create({
	loginHeader: {
		backgroundColor: 'white',
		height: 100,
		justifyContent: 'center',
		paddingTop: StatusBar.currentHeight
	},
	loginBackBtnContainer: {
		padding: 24,
		marginTop: 50
	}
});

export default () => (
	<AuthProvider>
		<LoadingProvider>
			<AxiosProvider>
				<App />
				<LoadingOverlay/>
			</AxiosProvider>
		</LoadingProvider>
	</AuthProvider>
);
