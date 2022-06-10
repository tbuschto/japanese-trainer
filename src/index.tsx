import React from 'react';
// import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {instance} from './app/JapaneseTrainer';
import {App} from './App';
import './index.css';

// const container = document.getElementById('root')!;
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Provider store={instance.store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

import { render } from 'react-dom'

render((
  <React.StrictMode>
    <Provider store={instance.store}>
      <App />
    </Provider>
  </React.StrictMode>
), document.getElementById('root'))
