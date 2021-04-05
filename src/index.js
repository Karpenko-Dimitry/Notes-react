import React from 'react';
import ReactDom from 'react-dom';
import App from './app';
import './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

ReactDom.render(<App />, 
  document.getElementById('root'));