import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Spinner from './Spinner';
import { ContextFun } from '../Context';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

describe("Test for spinner component", () => {

    beforeEach(() => {
        mockAxios.reset();
    });

    test("renders Spinner",async () => {
        render(
            <ContextFun>
                <Router>
                    <Spinner/>
                </Router>
            </ContextFun>
        );

        let divChilds = document.getElementsByClassName('input-number')[0].childNodes;
        expect(divChilds.length).toBe(3);
    });   

    test('should increment and decrement value', async () => {
        render(
            <ContextFun>
                <Router>
                    <Spinner/>
                </Router>
            </ContextFun>
        );

        let spanElem = document.getElementsByClassName('input-number')[0].childNodes[1];
        let btDec = document.getElementsByClassName('input-number')[0].childNodes[0];
        let btInc = document.getElementsByClassName('input-number')[0].childNodes[2];
        expect(spanElem.textContent).toBe("0");
        fireEvent.click(btDec); 
        expect(spanElem.textContent).toBe("-1");
        fireEvent.click(btInc);  
        fireEvent.click(btInc); 
        expect(spanElem.textContent).toBe("1");
    });
    
});

