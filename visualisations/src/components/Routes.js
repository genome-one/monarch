import React from 'react';
import {
  HashRouter,
  Route
} from 'react-router-dom';

import Triptych from './Triptych/Triptych';
import triptychTestData from './Triptych/Triptych.testData';
import Radar from './Radar/Radar';
import radarTestData from './Radar/Radar.testData';

import OwlsimTriptych from './../containers/OwlsimTriptych';

export default function Routes() {
  return (
    <HashRouter key={Math.random()}>
      <div>
        <Route path="/triptych" component={() => <Triptych data={triptychTestData()}/>} />
        <Route path="/radar" component={() => <Radar data={radarTestData()}/>} />
        
        <Route path="/owlsimtriptych" component={OwlsimTriptych} />
      </div>
    </HashRouter>
  );
}
