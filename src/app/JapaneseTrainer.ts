import {createStore, Store, applyMiddleware} from 'redux';
import * as rxjs from 'rxjs';
import thunk from 'redux-thunk';
import {History, createBrowserHistory} from 'history';
import {push, routerMiddleware} from 'connected-react-router';
import {AllReducer} from './Reducer';
import {Action, AsyncAction, createNewLesson, setCurrentLesson, setLessonName} from './actions';
import {AppState, LessonId, RootPath} from './types';

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

  readonly keyChange = (key: keyof AppState): rxjs.Observable<AppState> =>
    this.state.pipe(rxjs.distinctUntilKeyChanged(key));

  readonly setCurrentLesson = (lessonId: LessonId) =>
    this.store.dispatch(setCurrentLesson(lessonId));

  readonly createNewLesson = () =>
    this.store.dispatch(createNewLesson());

  readonly setLessonName = (text: string) =>
    this.store.dispatch(setLessonName(text));

  readonly setScreen = (screen: RootPath) =>
    this.store.dispatch(push(screen));

}

export const instance = new JapaneseTrainer();
