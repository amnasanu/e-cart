import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './bootstrap.min.css';
import { Provider } from 'react-redux'
import store  from './store'
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
