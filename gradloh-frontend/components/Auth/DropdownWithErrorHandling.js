// DropdownWithErrorHandling.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DropdownWithErrorHandling = ({
	data,
	value,
	placeholder = 'Select an option',
	error = false,
	setValue,
	setIsFocus,
	setError,
	isSearch = false,
	searchPlaceholder = 'Search...'
}) => {
	return (
		<View>
			<Dropdown
				style={[styles.dropdown, error && styles.dropdownError]}
				data={data}
				value={value}
				labelField="label"
				valueField="value"
				placeholder={placeholder}
				placeholderStyle={[
					styles.dropdownPlaceholder,
					error && styles.dropdownErrorText
				]}
				iconColor={error ? '#D00E17' : '#CBCBCB'}
				onChange={(item) => {
					setValue(item.value);
					setIsFocus(false);
					setError(false);
				}}
				search={isSearch}
				searchPlaceholder={searchPlaceholder}
			/>
			{error && (
				<View style={styles.errorContainer}>
					<Icon
						name="error"
						size={16}
						color="#D00E17"
						style={styles.errorIcon}
					/>
					<Text style={styles.errorMessage}>
						This field is required.
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	dropdown: {
		borderBottomWidth: 1,
		borderBottomColor: '#CBCBCB'
	},
	dropdownPlaceholder: {
		color: '#CBCBCB'
	},
	dropdownError: {
		borderBottomColor: '#D00E17'
	},
	dropdownErrorText: {
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

export default DropdownWithErrorHandling;
