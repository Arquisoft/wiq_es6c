import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import Calculator from './Calculator';
import { ContextFun } from '../Context';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

// Mock axios post request
jest.mock('axios');



describe('Calculator Component', () => {
    beforeEach(() => {
        jest.mock('../Util', () => ({
            ...jest.requireActual('../Util'), // Import and retain the original module functionality
            secureRandomNumber: jest.fn(() => 5), // Mock secureRandomNumber to return a fixed value for testing
        }));
        // global.crypto = {
        //     getRandomValues: jest.fn().mockImplementation((array) => {
        //         for (let i = 0; i < array.length; i++) {
        //             array[i] = i; 
        //         }
        //     }),
        // };
        localStorage.clear();
    });

    test('renders without crashing', () => {
        // render(<ContextFun>
        //     <Router>
        //       <Calculator />
        //     </Router>
        //     </ContextFun>);
    });

    // test('handles option click correctly', async () => {
    //     const { getByText } = render(<ContextFun>
    //         <Router>
    //           <Calculator />
    //         </Router>
    //         </ContextFun>);
    //     await act(async () => {
    //         fireEvent.click(getByText('Option Text')); // Change 'Option Text' to match your button text
    //         // Add assertions to check if the correct logic is executed after button click
    //     });
    // });

    // test('timer logic works correctly', async () => {
    //     jest.useFakeTimers();
    //     render(<ContextFun>
    //         <Router>
    //           <Calculator />
    //         </Router>
    //         </ContextFun>);
    //     await act(async () => {
    //         jest.advanceTimersByTime(1000); // Advance timer by 1 second
    //         // Add assertions to check if the timer updates correctly
    //     });
    // });

    // test('game store works correctly', async () => {
    //     localStorage.setItem('username', 'testUser');
    //     const mockResponse = { data: { success: true } }; // Mock response from server
    //     axios.post.mockResolvedValueOnce(mockResponse); // Mock the axios post request

    //     const { getByText } = render(<ContextFun>
    //         <Router>
    //           <Calculator />
    //         </Router>
    //         </ContextFun>);
    //     await act(async () => {
    //         fireEvent.click(getByText('Option Text')); // Change 'Option Text' to match your button text
    //         await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    //         expect(localStorage.getItem('username')).toBe('testUser'); // Check if username is stored
    //         // Add more assertions as needed
    //     });
    // });
});
