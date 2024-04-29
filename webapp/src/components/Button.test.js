import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';


describe('Button component', () => {

    test('renders button', () => {
        const { getByText } = render(<Button text="Click me" />);

        //Comprobamos que tenemos el texto
        expect(getByText('Click me')).toBeInTheDocument();
    });

    test('clicamos el boton', () => {
        const handleClick = jest.fn();

        const { getByText } = render(<Button text="Click me" onClick={handleClick} />);
        
        //intentamos clicar el botón con una tecla que no sea enter
        fireEvent.keyDown(getByText('Click me'), { key: 'Space' });
        expect(handleClick).not.toHaveBeenCalled();
        //hacemos click normal
        fireEvent.click(getByText('Click me'));
        expect(handleClick).toHaveBeenCalled();
        //clicamos el boton con la tecla enter
        fireEvent.keyDown(getByText('Click me'), { key: 'Enter' });
        expect(handleClick).toHaveBeenCalled();
        
    });

});