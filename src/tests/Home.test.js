import React from "react";
import { shallow } from "enzyme";
import Home from "../components/Home";
import MapGL, { HTMLOverlay, Marker, Popup } from 'react-map-gl';
import Sidebar from './Sidebar';

beforeAll(() => {
  global.fetch = jest.fn();
});

let wrapper;
beforeEach(() => {
   wrapper = shallow(<Home />, { disableLifecycleMethods: true });
});
afterEach(() => {
   wrapper.unmount();
});

it("must show the p.user and hide the loading span after api call success", 
(done) => {
// here we are spying on componentDidMount to know that it has been called
const spyDidMount = jest.spyOn(Home.prototype,"componentDidMount");
const sampleData = [
    {"area":"Unstad","country":"Norway","lat":68.26941680908203,"lon":13.57955074310303,"name":"Unstad Beach"},
    {"area":"Skallelv","country":"Norway","lat":70.18814849853516,"lon":30.3609676361084,"name":"Skallelv"},
    {"area":"Ohtakari","country":"Finland","lat":64.09400177001953,"lon":23.39699935913086,"name":"Ohtakari"},
    {"area":"Klippan","country":"Finland","lat":63.47999954223633,"lon":22.26399993896484,"name":"Storsand"},
    {"area":"M\u00e4ntyluoto","country":"Finland","lat":61.58499908447266,"lon":21.49600028991699,"name":"Poliisinlahti"},
    {"area":"Kaanaa","country":"Finland","lat":61.56100082397461,"lon":21.51799964904785,"name":"Yyteri"},
    {"area":"Helsinki","country":"Finland","lat":60.14500045776367,"lon":24.87199974060059,"name":"Sarkiniemi"},
    {"area":"Padva","country":"Finland","lat":59.96200180053711,"lon":22.84799957275391,"name":"Padva Beach"},
    {"area":"Hanko","country":"Finland","lat":59.81999969482422,"lon":22.92099952697754,"name":"Tulliniemi"},
    {"area":"U\u017eava, U\u017eava parish","country":"Latvia","lat":57.24700164794922,"lon":21.41200065612793,"name":"Palmu Uzava"},
    {"area":"P\u0101vilosta, P\u0101vilostas pils\u0113ta","country":"Latvia","lat":56.89199829101562,"lon":21.17600059509277,"name":"Pavilosta"},
    {"area":"Liep\u0101ja, Liep\u0101jas pils\u0113ta","country":"Latvia","lat":56.56100082397461,"lon":21.00099945068359,"name":"Palmu Licis"},
    {"area":"Herrhamra","country":"Sweden","lat":58.79899978637695,"lon":17.80900001525879,"name":"Toro Stenstrand"},
    {"area":"B\u00f6da","country":"Sweden","lat":57.27000045776367,"lon":17.05699920654297,"name":"Angjarnsudden"},
    {"area":"Simrishamn N","country":"Sweden","lat":55.63999938964844,"lon":14.2790002822876,"name":"Vik"},
    {"area":"Brantevik","country":"Sweden","lat":55.51900100708008,"lon":14.34799957275391,"name":"Brantevik"},
    {"area":"Nex\u00f8","country":"Denmark","lat":55.06499862670898,"lon":15.13799953460693,"name":"Nexo Harbor"},
    {"area":"D\u0105bki","country":"Poland","lat":54.38000106811523,"lon":16.31100082397461,"name":"Dabki"},
    {"area":"Leba","country":"Poland","lat":54.76900100708008,"lon":17.54299926757812,"name":"Leba"},
    {"area":"Wladyslawowo","country":"Poland","lat":54.80099868774414,"lon":18.40800094604492,"name":"Wladyslawowo"},
    {"area":"Wladyslawowo","country":"Poland","lat":54.79299926757812,"lon":18.42499923706055,"name":"Rurociag"},
    {"area":"Wladyslawowo","country":"Poland","lat":54.76900100708008,"lon":18.49200057983398,"name":"Chalupy"},
    {"area":"Gilleleje","country":"Denmark","lat":56.12863159179688,"lon":12.30512046813965,"name":"Gilleleje havn"}
];

const sampleDataLength = sampleData.length;

fetch.mockImplementation(() => {
   return Promise.resolve({
     status: 200,
     json: () => {
     return Promise.resolve(sampleData);
    }
  });
});

const didMount = wrapper.instance().componentDidMount();
// expecting componentDidMount have been called
expect(spyDidMount).toHaveBeenCalled();
didMount.then(() => {
   // updating the wrapper
   wrapper.update();
   expect(wrapper.instance().state.instruments.length).toBe(sampleDataLength);
   expect(wrapper.instance().state.userCurrentLat).toBe(sampleDataLength);
   expect(wrapper.instance().state.userCurrentLon).toBe(sampleDataLength);
   spyDidMount.mockRestore();
   fetch.mockClear();
   done();
});
});