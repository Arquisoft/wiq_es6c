import { shuffleArray, secureRandomNumber } from './Util';
import axios from 'axios';

jest.mock('axios');

describe('shuffleArray function', () => {
    // Mocking window.crypto.getRandomValues
    beforeEach(() => {
        global.crypto = {
        getRandomValues: jest.fn().mockImplementation((array) => {
            for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 100); // Mocking random values
            }
        }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('shuffles the array', () => {
        const array = [1, 2, 3, 4, 5];
        const shuffledArray = shuffleArray(array);
        expect(shuffledArray).not.toEqual(array); 
    });

    test('does not mutate the original array', () => {
        const array = [1, 2, 3, 4, 5];
        const originalArray = [...array]; 
        shuffleArray(array);
        expect(array).toEqual(originalArray); 
    });
});

describe('secureRandomNumber function', () => {

    test('generates a secure random number', () => {
        const max = 100;
        const randomNumber = secureRandomNumber(max);

        //comprobamos que el numero obtenido es < que el máximo
        expect(randomNumber).toBeLessThan(max);         
        //comprobamos que el numero obtenido es >= 0
        expect(randomNumber).toBeGreaterThanOrEqual(0); 
    });

});
