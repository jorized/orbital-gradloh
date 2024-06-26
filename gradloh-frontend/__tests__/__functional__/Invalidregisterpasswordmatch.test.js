import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../../screens/Auth/RegisterScreen';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

jest.useFakeTimers();

// Mocking useFonts to always return true
jest.mock('expo-font', () => ({
  useFonts: () => [true]
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome: (props) => <Text {...props}>{props.name}</Text>,
    MaterialIcons: (props) => <Text {...props}>{props.name}</Text>,
    Feather: (props) => <Text {...props}>{props.name}</Text>,
    Ionicons: (props) => <Text {...props}>{props.name}</Text>,
    Entypo: (props) => <Text {...props}>{props.name}</Text>,
    Fontisto: (props) => <Text {...props}>{props.name}</Text>,
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>,
    Octicons: (props) => <Text {...props}>{props.name}</Text>,
    SimpleLineIcons: (props) => <Text {...props}>{props.name}</Text>,
    Zocial: (props) => <Text {...props}>{props.name}</Text>,
    createIconSet: (props) => <Text {...props}>{props.name}</Text>,
    createIconSetFromFontello: (props) => <Text {...props}>{props.name}</Text>,
    createIconSetFromIcoMoon: (props) => <Text {...props}>{props.name}</Text>,
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

const mockAuthContext = {
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn()
};

const mockAxiosContext = {
  publicAxios: {
    post: jest.fn(() => {
      return Promise.reject({
        response: {
          data: {
            message: 'Passwords do not match.'
          }
        }
      });
    })
  }
};

describe('RegisterScreen', () => {
  it('displays a toast message when passwords do not match and all fields are filled', async () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <AxiosContext.Provider value={mockAxiosContext}>
          <NavigationContainer>
            <RegisterScreen />
          </NavigationContainer>
        </AxiosContext.Provider>
      </AuthContext.Provider>
    );

    const nicknameInput = getByTestId('nicknameInput');
    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');
    const confirmPasswordInput = getByTestId('confirmPasswordInput');
    const termsCheckBox = getByTestId('termsCheckBox');
    const registerButton = getByTestId('registerButton');

    // Fill out all fields
    fireEvent.changeText(nicknameInput, 'testuser');
    fireEvent.changeText(emailInput, 'testuser@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password456');
    fireEvent.press(termsCheckBox);

    // Press the register button
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.',
        visibilityTime: 5000,
        autoHide: true,
        position: 'bottom',
        bottomOffset: 40
      });
    });
  });
});
