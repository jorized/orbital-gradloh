import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import FolderDetailsScreen from '../../screens/CoursePlanner/FolderDetailsScreen';
import { AxiosContext } from '../../contexts/AxiosContext';
import ThemeContext from '../../contexts/ThemeContext';
import { LoadingContext } from '../../contexts/LoadingContext';

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
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn(), dispatch: jest.fn() }),
  useRoute: () => ({
    params: {
      headerName: 'FolderName',  // Ensure this matches the expected pattern for your regex
      semIndex: 1,
      startTutorial: false
    }
  }),
}));


jest.mock('expo-secure-store', () => ({
    getItem: jest.fn().mockImplementation(() => JSON.stringify({ email: 'test@u.nus.edu' }))
}));

const mockAxiosContextValue = {
    authAxios: {
      get: jest.fn().mockResolvedValue({
        data: { modsInSpecificFolder: [] }
      }),
      delete: jest.fn().mockResolvedValue({})
    },
  };
  
  const mockThemeContextValue = {
    backgroundColor: '#fff',
    reverseColor: '#000',
    hamburgerColor: '#ccc'
  };
  
  const mockLoadingContextValue = {
    setIsLoading: jest.fn()
  };
  
  describe('FolderDetailsScreen', () => {
    it('renders correctly', async () => {
      let tree;
      
  
      await act(async () => {
        tree = TestRenderer.create(
          <LoadingContext.Provider value={mockLoadingContextValue}>
            <AxiosContext.Provider value={mockAxiosContextValue}>
              <ThemeContext.Provider value={mockThemeContextValue}>
                <NavigationContainer>
                  <FolderDetailsScreen route={{ params: { headerName: 'Y1S1', semIndex: 1, startTutorial: false } }} />
                </NavigationContainer>
              </ThemeContext.Provider>
            </AxiosContext.Provider>
          </LoadingContext.Provider>
        ).toJSON();
      });
  
      expect(tree).toMatchSnapshot();
    });
  });