import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingOneScreen from '../../screens/Auth/OnboardingScreen';
import { AuthContext } from '../../contexts/AuthContext';
import { AxiosContext } from '../../contexts/AxiosContext';

// Mock the navigation and route
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: {
        nickname: 'JohnDoe',
        email: 'test@example.com',
        accessToken: 'dummyAccessToken',
        refreshToken: 'dummyRefreshToken',
      },
    }),
  };
});

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
}));

const mockAuthContextValue = {
  authState: { authenticated: false },
  setAuthState: jest.fn(),
  getAccessToken: jest.fn(),
  logout: jest.fn(),
};

const mockAxiosContextValue = {
  publicAxios: {
    authAxios: {
      post: jest.fn().mockResolvedValue({ data: { message: 'Success' } }),
    },
  },
};

describe('OnboardingOneScreen', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <AuthContext.Provider value={mockAuthContextValue}>
          <AxiosContext.Provider value={mockAxiosContextValue}>
            <NavigationContainer>
              <OnboardingOneScreen />
            </NavigationContainer>
          </AxiosContext.Provider>
        </AuthContext.Provider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
