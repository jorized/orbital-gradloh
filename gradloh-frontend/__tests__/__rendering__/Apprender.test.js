import React from 'react';
import TestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoadingProvider } from '../../contexts/LoadingContext';
import { AxiosProvider } from '../../contexts/AxiosContext';
import App from '../../App';
import { act } from 'react-dom/test-utils';


// Mocking necessary modules directly within this test file
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLocale: 'en-US',
      AppleLanguages: ['fr-FR', 'en-US'],
    },
    getConstants: () => ({
      settings: {
        AppleLocale: 'en-US',
        AppleLanguages: ['fr-FR', 'en-US'],
      },
    }),
  };
  return {
    ...RN,
    BackHandler: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const actualNav = jest.requireActual('@react-navigation/stack');
  return {
    ...actualNav,
    createStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    }),
  };
});

jest.mock('@react-navigation/drawer', () => {
  const actualNav = jest.requireActual('@react-navigation/drawer');
  return {
    ...actualNav,
    createDrawerNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ children }) => <>{children}</>,
    }),
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(JSON.stringify({ accessToken: 'token', refreshToken: 'token' })),
  setItemAsync: jest.fn().mockResolvedValue(),
}));

jest.mock('../../components/SplashScreen', () => 'SplashScreen');
jest.mock('../../components/Spinner', () => 'Spinner');
jest.mock('../../components/LoadingOverlay', () => 'LoadingOverlay');
jest.mock('../../components/Drawer/LogoutDrawerContent', () => 'LogoutDrawerContent');
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  AuthProvider: ({ children }) => <>{children}</>,
  AuthContext: {
    Consumer: ({ children }) => children({
      authState: { authenticated: true },
      setAuthState: jest.fn(),
    }),
  },
}));

describe('App', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <AuthProvider>
          <LoadingProvider>
            <AxiosProvider>
              <NavigationContainer>
                <App />
              </NavigationContainer>
            </AxiosProvider>
          </LoadingProvider>
        </AuthProvider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});