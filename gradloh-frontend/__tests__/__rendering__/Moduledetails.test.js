import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import ModuleDetailsScreen from '../../screens/CoursePlanner/ModuleDetailsScreen';
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

jest.mock('expo-secure-store', () => ({
  getItem: jest.fn().mockImplementation(() => JSON.stringify({ email: 'test@u.nus.edu' })),
}));

const mockAxiosContextValue = {
  authAxios: {
    get: jest.fn().mockResolvedValue({
      data: {
        moduleCode: 'CS1010',
        title: 'Programming Methodology',
        department: 'Computer Science',
        faculty: 'School of Computing',
        moduleCredit: 4,
        description: 'Introduction to programming.',
        prerequisite: 'None',
        preclusion: 'None',
        gradingBasisDescription: 'Graded',
        workload: [2, 1, 1, 3, 3],
        semesterData: [],
      },
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
  setIsLoading: jest.fn(),
};

describe('ModuleDetailsScreen', () => {
  let routeParams;
  let tree;

  beforeEach(() => {
    routeParams = {
      headerName: 'Module Details',
      moduleCode: 'CS1010',
      startTutorial: false,
    };
  });

  afterEach(() => {
    // Clean up after each test case
    if (tree) {
      tree.unmount();
    }
  });

  it('renders correctly', async () => {
    await act(async () => {
      tree = TestRenderer.create(
        <LoadingContext.Provider value={mockLoadingContextValue}>
          <AxiosContext.Provider value={mockAxiosContextValue}>
            <ThemeContext.Provider value={mockThemeContextValue}>
              <NavigationContainer>
                <ModuleDetailsScreen
                  route={{ params: routeParams }}
                  navigation={{ goBack: jest.fn(), dispatch: jest.fn() }}
                />
              </NavigationContainer>
            </ThemeContext.Provider>
          </AxiosContext.Provider>
        </LoadingContext.Provider>
      );
    });

    // Use setTimeout to delay and ensure all async operations are completed
    await act(async () => {
      jest.runAllTimers();
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
