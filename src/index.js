import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import Amplify from 'aws-amplify';
import config from './aws-exports';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
