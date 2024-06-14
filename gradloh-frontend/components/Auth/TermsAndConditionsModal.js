import {
	Lexend_400Regular,
	Lexend_600SemiBold,
	Lexend_700Bold
} from '@expo-google-fonts/lexend';
import { useFonts } from 'expo-font';
import React from 'react';
import {
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native';

const TermsAndConditionsModal = ({ visible, onClose }) => {
	const [fontsLoaded] = useFonts({
		Lexend_400Regular,
		Lexend_600SemiBold,
		Lexend_700Bold
	});

	if (!fontsLoaded) {
		return <Text>Loading...</Text>;
	}

	return (
		<Modal visible={visible} transparent={true}>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<View style={styles.modalTitleContainer}>
						<Text style={styles.modalTitle}>
							Terms and Conditions
						</Text>
					</View>
					<ScrollView style={styles.scrollView}>
						<Text style={styles.sectionTitle}>
							Important Notice
						</Text>
						<Text style={styles.modalText}>
							{'\n'}Welcome to GradLoh. By using our services, you
							agree to comply with and be bound by the following
							terms and conditions. Please review the following
							terms carefully.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>
							Data Collection and Usage
						</Text>
						<Text style={styles.modalText}>
							{'\n'}1. Email Addresses{'\n'}- We require users to
							sign up with their NUS student email addresses
							ending with @u.nus.edu.{'\n'}- This email is used
							solely for authentication and communication purposes
							related to the project.{'\n'}
							{'\n'}2. Personal Information{'\n'}- We collect
							minimal personal information, such as your nickname
							and email address.{'\n'}- This information is used
							exclusively to facilitate your use of our services
							and to enhance your experience.{'\n'}
							{'\n'}3. Password Security{'\n'}- Passwords are
							securely stored using industry-standard encryption
							techniques.{'\n'}- We do not store plain text
							passwords, and we recommend that you use a unique
							password for our service.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>Data Privacy</Text>
						<Text style={styles.modalText}>
							{'\n'}1. Confidentiality{'\n'}- We do not share,
							sell, or disclose your personal information to third
							parties.{'\n'}- Your data is kept confidential and
							is only accessible to authorized personnel involved
							in the development and maintenance of this project.
							{'\n'}
							{'\n'}2. No Tracking{'\n'}- We do not track or
							monitor your activity on our platform beyond what is
							necessary for the functionality of the service.
							{'\n'}- No sensitive personal information is
							collected or used for tracking purposes.{'\n'}
							{'\n'}3. Development Purposes{'\n'}- This project is
							an NUS Orbital Project and is intended for
							development and educational purposes.{'\n'}- All
							data collected will not be used for any ill-intended
							purposes.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>
							User Responsibilities
						</Text>
						<Text style={styles.modalText}>
							{'\n'}1. Accurate Information{'\n'}- Users are
							responsible for providing accurate and truthful
							information during the registration process.{'\n'}-
							Providing false information may result in the
							suspension or termination of your account.{'\n'}
							{'\n'}2. Account Security{'\n'}- Users are
							responsible for maintaining the confidentiality of
							their account credentials.{'\n'}- Notify us
							immediately of any unauthorized use of your account
							or any other breach of security.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>
							Limitation of Liability
						</Text>
						<Text style={styles.modalText}>
							{'\n'}- Our project is provided on an "as-is" basis.
							We do not warrant that the service will be
							uninterrupted or error-free.{'\n'}- We are not
							liable for any direct, indirect, incidental, or
							consequential damages resulting from the use or
							inability to use our services.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>
							Changes to Terms and Conditions
						</Text>
						<Text style={styles.modalText}>
							{'\n'}- We reserve the right to update or modify
							these terms at any time. Any changes will be posted
							on this page.{'\n'}- Continued use of our services
							after any such changes constitutes your acceptance
							of the new terms.{'\n'}
						</Text>

						<Text style={styles.sectionTitle}>Contact Us</Text>
						<Text style={styles.modalText}>
							{'\n'}If you have any questions or concerns about
							these terms and conditions or our data practices,
							please contact us at jorized@gmail.com or
							chrisyong2009@live.com{'\n'}
						</Text>
					</ScrollView>
					<TouchableOpacity
						onPress={onClose}
						style={styles.closeButton}
					>
						<Text style={styles.closeButtonText}>Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		paddingHorizontal: 30,
		paddingVertical: 60
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center'
	},
	modalTitle: {
		fontSize: 24,
		fontFamily: 'Lexend_700Bold',
		marginBottom: 10
	},
	scrollView: {
		marginBottom: 20
	},
	sectionTitle: {
		fontSize: 16,
		fontFamily: 'Lexend_600SemiBold',
		marginTop: 10,
		marginBottom: 5,
		textAlign: 'center',
		textDecorationLine: 'underline'
	},
	modalText: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'left'
	},
	closeButton: {
		alignSelf: 'center',
		padding: 10,
		backgroundColor: '#EF7C00',
		borderRadius: 5
	},
	closeButtonText: {
		color: 'white',
		fontWeight: 'bold'
	}
});

export default TermsAndConditionsModal;
