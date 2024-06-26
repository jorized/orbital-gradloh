import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	TextInput,
	Animated,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FloatingLabelInput = React.forwardRef(
	(
		{
			label,
			value,
			onChangeText,
			isPassword,
			onFocus,
			error,
			errorMessage,
			testID
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const [showPassword, setShowPassword] = useState(!isPassword);
		const animatedIsFocused = useRef(
			new Animated.Value(value === '' ? 0 : 1)
		).current;

		useEffect(() => {
			Animated.timing(animatedIsFocused, {
				toValue: isFocused || value !== '' ? 1 : 0,
				duration: 200,
				useNativeDriver: false
			}).start();
		}, [isFocused, value]);

		const labelStyle = {
			position: 'absolute',
			left: 0,
			top: animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [18, 0]
			}),
			fontSize: animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [16, 12]
			}),
			color: error
				? '#D00E17'
				: animatedIsFocused.interpolate({
						inputRange: [0, 1],
						outputRange: ['#aaa', '#000']
				  })
		};

		return (	
			<View style={styles.container}>
				<Animated.Text style={labelStyle}>{label}</Animated.Text>
				<View
					style={[styles.inputWrapper, error && styles.errorBorder]}
				>
					<TextInput
						ref={ref}
						value={value}
						style={[styles.input]}
						onFocus={(e) => {
							setIsFocused(true);
							onFocus && onFocus(e);
						}}
						onBlur={() => setIsFocused(false)}
						onChangeText={onChangeText}
						secureTextEntry={!showPassword}
						testID={testID}
					/>
					{isPassword && (
						<TouchableOpacity
							style={styles.icon}
							onPress={() => setShowPassword(!showPassword)}
						>
							<Icon
								name={
									showPassword
										? 'visibility'
										: 'visibility-off'
								}
								size={20}
								color="#585858"
							/>
						</TouchableOpacity>
					)}
				</View>
				{error && (
					<View style={styles.errorContainer}>
						<Icon
							name="error"
							size={16}
							color="#D00E17"
							style={styles.errorIcon}
						/>
						<Text style={styles.errorMessage}>{errorMessage}</Text>
					</View>
				)}
			</View>
		);
	}
);

const styles = StyleSheet.create({
	container: {
		paddingTop: 18,
		marginBottom: 20
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#aaa'
	},
	input: {
		flex: 1,
		height: 40,
		fontSize: 16,
		color: '#000'
	},
	icon: {
		padding: 10
	},
	errorBorder: {
		borderBottomColor: '#D00E17'
	},
	errorText: {
		color: '#D00E17'
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5
	},
	errorIcon: {
		marginRight: 5
	},
	errorMessage: {
		color: '#D00E17',
		fontSize: 12
	}
});

export default FloatingLabelInput;
