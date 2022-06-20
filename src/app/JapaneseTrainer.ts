import {Store} from 'redux';
import thunk from 'redux-thunk';
import {History, createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {persistStore, Persistor} from 'redux-persist';
import {createReducer} from './reducers';
import {AsyncAction} from './Action';
import {AppState} from './AppState';

export type AppStore = Store<AppState> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  readonly history: History;
  readonly store: AppStore;
  readonly persist: Persistor;

  constructor() {
    this.history = createBrowserHistory();
    this.store = configureStore({
      reducer: createReducer(this.history),
      middleware: [thunk, routerMiddleware(this.history), logger]
    }) as AppStore;
    this.persist = persistStore(this.store);
  }

}

export const trainer = new JapaneseTrainer();
