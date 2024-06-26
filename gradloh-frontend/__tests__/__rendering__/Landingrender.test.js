import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from '../../screens/Auth/LandingScreen';
import Toast from 'react-native-toast-message';

// Mock the toast message module
jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const Toast = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
  return {
    show: jest.fn(),
    hide: jest.fn(),
    default: Toast,
  };
});

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: {
        showToast: true,
        toastMessage: 'Welcome!',
      },
    }),
  };
});

describe('LandingScreen', () => {
  it('renders correctly', async () => {
    let tree;

    await act(async () => {
      tree = TestRenderer.create(
        <NavigationContainer>
          <LandingScreen />
        </NavigationContainer>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
