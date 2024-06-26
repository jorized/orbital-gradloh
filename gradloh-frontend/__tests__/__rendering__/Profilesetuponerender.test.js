import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ProfileSetUpOneScreen from '../../screens/Auth/ProfileSetUpOneScreen';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const Toast = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  return {
    show: jest.fn(),
    hide: jest.fn(),
    default: Toast,
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: jest.fn().mockReturnValue({
      params: {
        nickname: 'test',
        email: 'test@u.nus.edu',
        password: 'Password123%',
      },
    }),
  };
});

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('../../components/Auth/DropdownWithErrorHandling', () => 'DropdownWithErrorHandling');

const mockAuthContextValue = {
  authState: { authenticated: false },
  setAuthState: jest.fn(),
  getAccessToken: jest.fn(),
  logout: jest.fn(),
};

const mockAxiosContextValue = {
  publicAxios: {
    post: jest.fn().mockResolvedValue({ data: { message: 'Success' } }),
  },
  authAxios: {
    post: jest.fn().mockResolvedValue({ data: { message: 'Success' } }),
  },
};

describe('ProfileSetUpOneScreen', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <AuthContext.Provider value={mockAuthContextValue}>
          <AxiosContext.Provider value={mockAxiosContextValue}>
            <NavigationContainer>
              <ProfileSetUpOneScreen />
            </NavigationContainer>
          </AxiosContext.Provider>
        </AuthContext.Provider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
