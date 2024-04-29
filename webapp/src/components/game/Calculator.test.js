import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ContextFun } from '../Context';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Calculator from './Calculator';

describe('Calculator Component', () => {
    beforeEach(() => {
        global.crypto = {
            getRandomValues: jest.fn().mockImplementation((array) => {
                for (let i = 0; i < array.length; i++) {
                    array[i] = i; 
                }
            }),
        };
    });
  
    test("renders Calculator",async () => {
        
        /*render(
            <ContextFun>
                <Router>
                    <Calculator/>
                </Router>
            </ContextFun>
        );

        // Comprobamos que el número de elementos sea 3
        let operation = document.getElementsByClassName('questionStructure')[0][0];
        const separatedText = operation.split(' ');
        expect(separatedText.length).toBeGreaterThan(3);
        // Comprobamos que el número de respuestas posibles sea 4
        let answers = document.getElementsByClassName('questionStructure')[1];
        expect(answers).toHaveLength(4);
        // Tratamos de hacer la operación
        let number1 = separatedText[0];
        let number2 = separatedText[2];
        let op = separatedText[1];
        let result;
        switch (op) {
            case '+': result = number1 + number2; break;
            case '-': result = number1 - number2; break;
            case 'x': result = number1 * number2; break;
            case '÷': result = Math.round(number1 / number2); break;
        }
        expect(screen.getByText(result)).toBeInTheDocument();*/
        
    });

 
});
