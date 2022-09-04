import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {trainer} from './app/JapaneseTrainer';
import {App} from './App';
import './index.css';
import {japanese} from './worker';
// import * as X from 'kuromoji/src/loader/DictionaryLoader';

(async () => {
  console.info('let\'s tokenize');
  console.info(japanese);
  console.info(await japanese.test('あるみかんのうえにあるみかん'));
})().catch(ex => console.error(ex));

render((
  <React.StrictMode>
    <Provider store={trainer.store}>
      <App />
    </Provider>
  </React.StrictMode>
), document.getElementById('root'));

