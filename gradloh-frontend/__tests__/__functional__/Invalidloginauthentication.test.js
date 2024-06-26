import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/Auth/LoginScreen';
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
            message: 'Invalid email or password.'
          }
        }
      });
    })
  }
};

describe('LoginScreen', () => {
  it('displays a toast message when authentication fails due to invalid credentials', async () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <AxiosContext.Provider value={mockAxiosContext}>
          <NavigationContainer>
            <LoginScreen />
          </NavigationContainer>
        </AxiosContext.Provider>
      </AuthContext.Provider>
    );

    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');
    const loginButton = getByTestId('loginButton');

    // Fill out email and password fields
    fireEvent.changeText(emailInput, 'testuser@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    // Press the login button
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid email or password.',
        visibilityTime: 5000,
        autoHide: true,
        position: 'bottom',
        bottomOffset: 40
      });
    });
  });
});
