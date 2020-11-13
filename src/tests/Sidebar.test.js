import React from 'react';
import Sidebar from '../components/Sidebar';
import { shallow, mount } from 'enzyme';
import { it } from 'date-fns/locale';

describe('Sidebar component', () => {
    it('shallow renders Sidebar component without crashing', () => {
        shallow(<Sidebar />)
    })
    it('full renders Sidebar component without crashing', () => {
        
    })
})