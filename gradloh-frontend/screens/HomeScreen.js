import React, { useContext, useEffect } from 'react';
import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { AxiosContext } from '../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import Hamburger from '../components/Hamburger';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import BottomSheet from '../components/BottomSheet';

export default function HomeScreen({ navigation }) {
	const axiosContext = useContext(AxiosContext);

	const test = SecureStore.getItem('token');

	return (
		<>
			<View style={styles.upperContainer}>
				<LinearGradient
					colors={['#20292F', '#36454F', '#909090', '#FAF0E6']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1.2 }}
					style={styles.upperContainer}
				>
					<SafeAreaView style={{ flex: 1 }}>
						<ScrollView>
							<Hamburger
								onPress={() => navigation.openDrawer()}
							/>

							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignSelf: 'center'
								}}
							>
								<AnimatedProgressWheel
									size={300}
									width={20}
									color={'skyblue'}
									progress={45}
									animateFromValue={-1}
									showProgressLabel={true}
									subtitle={'Progress as of today'}
									subtitleStyle={{ color: 'lightblue' }}
									duration={3000}
									labelStyle={{
										color: 'skyblue',
										fontSize: 40
									}}
									backgroundColor={'grey'}
								/>
							</View>
						</ScrollView>
					</SafeAreaView>
				</LinearGradient>
			</View>
			<BottomSheet />
		</>
	);
}

const styles = StyleSheet.create({
	upperContainer: {
		flex: 1,
		width: '100%'
	},
	lowerContainer: {
		flex: 2,
		width: '100%',
		backgroundColor: '#36454F'
	},
	hamburgerContainer: {
		width: 10,
		height: 4,
		backgroundColor: 'white',
		borderRadius: 100
	},
	text: {
		color: 'black'
	}
});
