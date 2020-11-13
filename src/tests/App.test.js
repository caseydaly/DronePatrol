import React from 'react';
import App from '../App';
import { shallow, mount } from 'enzyme';

describe('App component', () => {
    it('shallow renders App component without crashing', () => {
        shallow(<App />)
    })
})