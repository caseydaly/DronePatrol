import React from 'react';
import Home from './components/Home';
import ReactGA from 'react-ga';
import history from './utils/history';

export default function App() {

  //Google Analytics setup - provide tracking metrics about the app
  ReactGA.initialize('UA-183759998-1');
  ReactGA.pageview(window.location.pathname);

  return (
    <div style={{height: "100%", width: "100%", flex: 1}}>
      <Home style={{height: "100%", width:"100%", flex: 1}}/>
    </div>
  );
};
