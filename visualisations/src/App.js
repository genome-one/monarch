import React, { Component } from 'react';
import './App.css';
import Triptych from './components/Triptych/Triptych'
import triptychTestData from './components/Triptych/Triptych.testData'

class App extends Component {
  render() {
    return (
      <div>
        <Triptych data={triptychTestData()} />
      </div>
    );
  }
}

export default App;
