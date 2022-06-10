import {Store} from 'redux';
import thunk from 'redux-thunk';
import {History, createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import {configureStore} from '@reduxjs/toolkit';
import {AllReducer} from './Reducer';
import {Action, AsyncAction} from './actions';
import {AppState} from './types';

export type AppStore = Store<AppState, Action> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  readonly history: History;
  readonly store: AppStore;

  constructor() {
    this.history = createBrowserHistory();
    this.store = configureStore({
      reducer: new AllReducer(this.history).japaneseTrainer,
      middleware: [thunk, routerMiddleware(this.history)]
    }) as AppStore;
  }

}

export const trainer = new JapaneseTrainer();
