import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './config/routes';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
  document.getElementById('root')
);
