import React from 'react';
import Home from './components/Home';
import ReactGA from 'react-ga';
import history from './utils/history';

export default function App() {

  //Google Analytics setup - provide tracking metrics about the app
  ReactGA.initialize('253807440');

  history.listen((location) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname)
  }
);
  return (
    <div style={{height: "100%", width: "100%", flex: 1}}>
      <Home style={{height: "100%", width:"100%", flex: 1}}/>
    </div>
  );
};
