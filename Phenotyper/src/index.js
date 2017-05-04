import React from 'react';
import {render} from 'react-dom';
import '../src/assets/scss/style.css';
import '../src/assets/scss/filepicker.css';
import '../src/assets/scss/dropzone.css';
import 'react-select/dist/react-select.css';
import 'react-notifications/lib/notifications.css';

import App from './components/app.js';

//Redux
import MonarchApp from './reducers/monarch-store.js';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
let store = createStore(MonarchApp);
// store.subscribe((render)=>
// {
//   console.log("store changed", store.getState());
// })

/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/

const appTarget = document.getElementById("app");

render(
  <Provider store={store}>
    <App/>
  </Provider>
,appTarget);
