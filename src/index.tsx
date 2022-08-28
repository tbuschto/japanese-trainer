import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {trainer} from './app/JapaneseTrainer';
import {App} from './App';
import './index.css';

render((
  <React.StrictMode>
    <Provider store={trainer.store}>
      <App />
    </Provider>
  </React.StrictMode>
), document.getElementById('root'));

// https://github.com/supasate/connected-react-router/issues/570
declare module 'connected-react-router' {

  interface ConnectedRouterProps {
    children?: JSX.Element;
  }

}
