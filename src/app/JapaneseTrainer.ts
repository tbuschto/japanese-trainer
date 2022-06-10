import {createStore, Store, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {History, createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import {AllReducer} from './Reducer';
import {Action, AsyncAction} from './actions';
import {AppState} from './types';

export type AppStore = Store<AppState, Action> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  readonly history: History
  readonly store: AppStore;

  constructor() {
    this.history = createBrowserHistory();
    this.store = createStore(
      new AllReducer(this.history).japaneseTrainer,
      applyMiddleware(thunk, routerMiddleware(this.history))
    ) as AppStore;
  }

}

export const instance = new JapaneseTrainer();
