import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AxiosContext } from '../../contexts/AxiosContext';
import ThemeContext from '../../contexts/ThemeContext';
import FolderScreen from '../../screens/CoursePlanner/FolderScreen';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

jest.useFakeTimers();

// Mocking useNavigation, useRoute, and useFocusEffect from react-navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
    useFocusEffect: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve(JSON.stringify({ email: 'test@example.com' }))),
    getItem: jest.fn().mockImplementation(() => JSON.stringify({ email: 'test@u.nus.edu' }))
}));

jest.mock('react-native-event-listeners', () => ({
    EventRegister: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    },
}));

const mockAxios = {
    authAxios: {
        get: jest.fn(() => Promise.resolve({ data: { currentSemester: 2, numOfModsInEachFolder: { '1': 5, '2': 3 } } })),
    },
};

const theme = {
    backgroundColor: '#fff',
    gradientColorBottomSheet: '#ccc',
    hamburgerColor: '#000',
    color: '#333',
};

describe('FolderScreen - Button Press and Navigation', () => {
    it('handles button press and navigation', async () => {
        const mockPush = jest.fn();
        useNavigation.mockReturnValue({ push: mockPush, addListener: jest.fn() });
        useRoute.mockReturnValue({ params: { headerName: 'All Folders', startTutorial: false } });
        useFocusEffect.mockImplementationOnce((callback) => callback());

        const { getByText } = render(
            <AxiosContext.Provider value={mockAxios}>
                <ThemeContext.Provider value={theme}>
                    <FolderScreen
                        headerName="All Folders"
                        navigation={{
                            push: mockPush,
                            navigate: jest.fn(),
                            addListener: jest.fn().mockImplementation((event, callback) => {
                                callback();
                                return { remove: jest.fn() };
                            }),
                        }}
                        route={{ params: { headerName: 'All Folders', startTutorial: false } }}
                    />
                </ThemeContext.Provider>
            </AxiosContext.Provider>
        );

        await waitFor(() => {
            expect(getByText('Y1S1')).toBeTruthy();
        });

        fireEvent.press(getByText('Y1S1'));

        expect(mockPush).toHaveBeenCalledWith('FolderDetailsScreen', { headerName: 'Y1S1', semIndex: 1 });
    });
});
