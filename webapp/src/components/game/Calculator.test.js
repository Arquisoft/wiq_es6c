import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ContextFun } from '../Context';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Calculator from './Calculator';

describe('Calculator Component', () => {
    jest.setTimeout(10000);
    
    test("renders Calculator",async () => {
        render(
            <ContextFun>
                <Router>
                    <Calculator/>
                </Router>
            </ContextFun>
        );

        // Comprobamos que el número de elementos sea 3
        let operation = document.getElementById("questionText").textContent;
        const separatedText = operation.split(' ');
        expect(separatedText.length).toBe(3);

        // Comprobamos que el número de respuestas posibles sea 4
        let answers = document.getElementsByClassName('allAnswers')[0].childNodes;
        expect(answers).toHaveLength(4);

        // Tratamos de hacer la operación
        //for(let i = 0; i < 2; i++){
            let number1 = parseInt(separatedText[0]);
            let number2 = parseInt(separatedText[2]);
            let op = separatedText[1];
            let result;
            switch (op) {
                case '+': result = number1 + number2; break;
                case '-': result = number1 - number2; break;
                case 'x': result = number1 * number2; break;
                case '÷': result = Math.round(number1 / number2); break;
            }
            let bt = screen.getByText(result);
            expect(bt).toBeInTheDocument();
            bt.click();
            expect(window.getComputedStyle(bt).getPropertyValue('background-color')).toBe("green");
                
            await new Promise(resolve => setTimeout(resolve, 3000));
            expect(window.getComputedStyle(bt).getPropertyValue('background-color')).not.toBe("green");      
        //}
    });
 
});