import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import { Nav } from './Nav';
import axios from 'axios';

const mockAxios = new MockAdapter(axios);

describe('Nav Component', () => {
    
    beforeEach(() => {
        mockAxios.reset();
    });

    it('renders without crashing', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>
        );
        expect(wrapper.find(Nav)).toHaveLength(1);
    });

    it('renders login button when not logged in', () => {
        const wrapper = mount(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>
        );
        expect(wrapper.find('Button').text()).toEqual('Login');
    });

    it('renders user information when logged in', async () => {
        const username = 'testuser';
        const isLogged = true;

        mockAxios.onAny().reply(200, {});

        let wrapper;

        await act(async () => {
            wrapper = mount(
                <MemoryRouter>
                    <Nav />
                </MemoryRouter>
            );
        });

        wrapper.find(Nav).find('Button').simulate('click');

        expect(wrapper.find('Button').text()).toEqual(username);
    });

/*    
    it('logs out correctly', async () => {
        const navigateMock = jest.fn();
        const destroySessionMock = jest.fn();

        const context = {
            username: 'testuser',
            isLogged: true,
            destroySession: destroySessionMock,
            navigate: navigateMock
        };

        const wrapper = mount(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>,
            { context }
        );

        wrapper.find(Nav).find('IconButton').simulate('click');

        expect(destroySessionMock).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith('/login');
    }); 
*/ 
});

