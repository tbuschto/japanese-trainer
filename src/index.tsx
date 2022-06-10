import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {trainer} from './app/JapaneseTrainer';
import {App} from './views/App';
import './index.css';

render((
  <React.StrictMode>
    <Provider store={trainer.store}>
      <App />
    </Provider>
  </React.StrictMode>
), document.getElementById('root'));
