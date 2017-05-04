import React from 'react';
// import UploadComponent from './upload-component/upload';
import UploadTabComponent from './upload-component/upload-tab';

import Header from './header';
import Footer from './footer';
/*
* Author: Nguyen Nguyen 
* Monarch annotator page beta created on 1/11/2016
*/
const App = () =>
{
  return (
    <div>
      <Header/>
      <UploadTabComponent/>
      <Footer/>
    </div>
  );
}

export default App;
