import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import ProfileSetUpTwoScreen from '../../screens/Auth/ProfileSetUpTwoScreen';
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

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      nickname: 'test',
      email: 'test@u.nus.edu',
      password: 'Password123%',
      enrolmentYear: '2022-2023'
    }
  }),
}));

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

describe('ProfileSetUpTwoScreen', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <AuthContext.Provider value={mockAuthContextValue}>
          <AxiosContext.Provider value={mockAxiosContextValue}>
            <NavigationContainer>
              <ProfileSetUpTwoScreen />
            </NavigationContainer>
          </AxiosContext.Provider>
        </AuthContext.Provider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
