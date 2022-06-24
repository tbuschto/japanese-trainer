import {Store} from 'redux';
import thunk from 'redux-thunk';
import {History, createBrowserHistory} from 'history';
import {routerMiddleware,connectRouter,RouterState} from 'connected-react-router';
import {configureStore, Reducer} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {persistStore, Persistor} from 'redux-persist';
import {createReducer} from './reducers';
import {AsyncAction} from './Action';
import {AppState, defaults} from './AppState';

export type AppStore = Store<AppState> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  readonly history: History;
  readonly store: AppStore;
  readonly persist: Persistor;
  readonly router: Reducer<RouterState<unknown>>;

  constructor() {
    this.history = createBrowserHistory();
    this.router = connectRouter(this.history);
    this.store = configureStore({
      reducer: createReducer(this.router),
      middleware: [thunk, routerMiddleware(this.history), logger],
      preloadedState: {...defaults, router: this.router(undefined, {type: undefined})}
    }) as AppStore;
    this.persist = persistStore(this.store);
  }

}

export const trainer = new JapaneseTrainer();
