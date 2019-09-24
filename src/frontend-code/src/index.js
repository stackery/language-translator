import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

Amplify.configure({
  // API: {
  //   endpoints: [
  //     {
  //       name: 'backend',
  //       endpoint: config.backendAPI
  //     }
  //   ]
  // }
  Storage: {
    AWSS3: {
      bucket: 'language-translator-development-originalf-053662045684'
    }
  }
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
