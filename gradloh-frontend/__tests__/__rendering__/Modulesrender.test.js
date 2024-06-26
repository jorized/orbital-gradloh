import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ModulesScreen from '../../screens/CoursePlanner/ModulesScreen';
import ThemeContext from '../../contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.useFakeTimers();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn(), dispatch: jest.fn() }),
  useRoute: () => ({
    params: {
      headerName: 'Modules List',
      semIndex: 1,
      folderName: 'Sample Folder',
      currentModsInFolder: [],
      startTutorial: false,
    },
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

const mockThemeContextValue = {
  backgroundColor: '#fff',
  reverseColor: '#000',
  hamburgerColor: '#ccc',
  gradientColorBottomSheet: '#eee',
  color: '#333',
};

describe('ModulesScreen', () => {
  it('renders correctly', async () => {
    let tree;

    const mockedParams = {
      route: {
        params: {
          headerName: 'Modules List',
          semIndex: 1,
          folderName: 'Sample Folder',
          currentModsInFolder: [],
          startTutorial: false,
        },
      },
    };

    await act(async () => {
      tree = TestRenderer.create(
        <ThemeContext.Provider value={mockThemeContextValue}>
          <NavigationContainer>
            <SafeAreaProvider>
              <ModulesScreen
                navigation={{
                  navigate: jest.fn(),
                  goBack: jest.fn(),
                }}
                {...mockedParams}
              />
            </SafeAreaProvider>
          </NavigationContainer>
        </ThemeContext.Provider>
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});
