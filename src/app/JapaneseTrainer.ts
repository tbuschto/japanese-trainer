import {createStore, Store, applyMiddleware} from 'redux';
import * as rxjs from 'rxjs';
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
  readonly state: rxjs.Observable<AppState>;

  constructor() {
    this.history = createBrowserHistory();
    this.store = createStore(
      new AllReducer(this.history).japaneseTrainer,
      applyMiddleware(thunk, routerMiddleware(this.history))
    ) as AppStore;
    this.state = rxjs.from(this.store);
  }

}

export const instance = new JapaneseTrainer();
