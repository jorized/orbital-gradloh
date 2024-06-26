import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import ThemeContext from '../../contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AxiosContext } from '../../contexts/AxiosContext';
import { LoadingContext } from '../../contexts/LoadingContext';
import * as SecureStore from 'expo-secure-store';

jest.useFakeTimers();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn(), dispatch: jest.fn() }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const Toast = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  return {
    show: jest.fn(),
    hide: jest.fn(),
    default: Toast,
  };
});

jest.mock('expo-secure-store', () => ({
  getItem: jest.fn().mockImplementation(() => JSON.stringify({ email: 'test@u.nus.edu', nickname: 'TestUser' })),
  getItemAsync: jest.fn().mockResolvedValue(JSON.stringify({ email: 'test@u.nus.edu', nickname: 'TestUser' })),
  setItemAsync: jest.fn().mockResolvedValue(),
}));

const mockThemeContextValue = {
  backgroundColor: '#fff',
  reverseColor: '#000',
  hamburgerColor: '#ccc',
  gradientColorBottomSheet: '#eee',
  color: '#333',
};

const mockAxiosContextValue = {
  authAxios: {
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
  },
};

const mockLoadingContextValue = {
  setIsLoading: jest.fn(),
};

describe('SettingsScreen', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <AxiosContext.Provider value={mockAxiosContextValue}>
          <LoadingContext.Provider value={mockLoadingContextValue}>
            <ThemeContext.Provider value={mockThemeContextValue}>
              <NavigationContainer>
                <SafeAreaProvider>
                  <SettingsScreen
                    toggleTheme={jest.fn()}
                    headerName="Settings"
                  />
                </SafeAreaProvider>
              </NavigationContainer>
            </ThemeContext.Provider>
          </LoadingContext.Provider>
        </AxiosContext.Provider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
