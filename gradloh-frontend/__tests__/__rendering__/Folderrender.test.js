import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import FolderScreen from '../../screens/CoursePlanner/FolderScreen';
import { AxiosContext } from '../../contexts/AxiosContext';
import ThemeContext from '../../contexts/ThemeContext';
import { LoadingContext } from '../../contexts/LoadingContext';

jest.useFakeTimers();

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
      headerName: 'All Folders',  // Ensure this matches the expected pattern for your regex
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
        data: { numOfModsInEachFolder: { 1: 5, 2: 3, 3: 4, 4: 2, 5: 1, 6: 0, 7: 0, 8: 0 }, currentSemester: 1 }
      }),
    },
  };
  
const mockThemeContextValue = {
    backgroundColor: '#fff',
    reverseColor: '#000',
    hamburgerColor: '#ccc',
    gradientColorBottomSheet: '#eee',
    color: '#333',
  };
  
const mockLoadingContextValue = {
    setIsLoading: jest.fn()
  };

describe('FolderScreen', () => {
    it('renders correctly', async () => {
      let tree;

      const mockedParams = {
        route: {     
                params: {
                headerName: 'All Folders', 
                startTutorial: false
            } 
        },
      };

      await act(async () => {
        tree = TestRenderer.create(
          <LoadingContext.Provider value={mockLoadingContextValue}>
            <AxiosContext.Provider value={mockAxiosContextValue}>
              <ThemeContext.Provider value={mockThemeContextValue}>
                <NavigationContainer>
                  <FolderScreen 
                    headerName="All Folders" 
                    navigation={{
                        navigate: jest.fn(),
                        addListener: jest.fn().mockImplementation((event, callback) => {
                          callback();
                          //returning value for `navigationSubscription`
                          return {
                             remove: jest.fn()
                          }
                        }),
                      }}
                    {...mockedParams}/>
                </NavigationContainer>
              </ThemeContext.Provider>
            </AxiosContext.Provider>
          </LoadingContext.Provider>
        ).toJSON();
      });

      expect(tree).toMatchSnapshot();
    });
});
