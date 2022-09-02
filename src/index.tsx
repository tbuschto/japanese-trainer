import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {trainer} from './app/JapaneseTrainer';
import {App} from './App';
import './index.css';
import {japanese} from './worker';

(async () => {
  console.info(await japanese.test('日本語'));
})().catch(ex => console.error(ex));

render((
  <React.StrictMode>
    <Provider store={trainer.store}>
      <App />
    </Provider>
  </React.StrictMode>
), document.getElementById('root'));
