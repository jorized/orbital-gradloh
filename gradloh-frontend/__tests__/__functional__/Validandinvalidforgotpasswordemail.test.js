import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';
import { NavigationContainer } from '@react-navigation/native';

// Mocking useFonts to always return true
jest.mock('expo-font', () => ({
  useFonts: () => [true]
}));


//Not including this will give Font.isLoaded error
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
    post: jest.fn()
  }
};

describe('ForgotPasswordScreen', () => {
  it('displays an error message for an invalid email', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <AuthContext.Provider value={mockAuthContext}>
        <AxiosContext.Provider value={mockAxiosContext}>
          <NavigationContainer>
            <ForgotPasswordScreen />
          </NavigationContainer>
        </AxiosContext.Provider>
      </AuthContext.Provider>
    );

    const emailInput = getByTestId('emailInput');
    const resetButton = getByTestId('resetButton');

    // Enter an invalid email
    fireEvent.changeText(emailInput, '');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(getByText('This field is required.')).toBeTruthy();
    });

    // Enter a valid email
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(resetButton);

    await waitFor(() => {
      expect(queryByText('This field is required.')).toBeFalsy();
    });
  });
});
