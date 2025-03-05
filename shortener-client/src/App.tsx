import React, { FC } from 'react';
import './App.css';
import Shortener from './components/Shortener';

const App: FC = () => {
  return (
    <div className="App">
      <Shortener />
    </div>
  );
};

export default App;

