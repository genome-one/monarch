import React from 'react';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

import Triptych from './Triptych/Triptych';
import triptychTestData from './Triptych/Triptych.testData';
import Radar from './Radar/Radar';
import radarTestData from './Radar/Radar.testData';

export default function Routes() {
  return (
    <BrowserRouter key={Math.random()}>
      <div>
        <Route path="/triptych" component={() => <Triptych data={triptychTestData()}/>} />
        <Route path="/radar" component={() => <Radar data={radarTestData()}/>} />
      </div>
    </BrowserRouter>
  );
}
