import {AppState, JTDict, LessonId, Screen, WordElementMode} from 'core';
import {createStore, Store, applyMiddleware} from 'redux';
import * as rxjs from 'rxjs';
import thunk from 'redux-thunk';
import {AllReducer} from './Reducer';
import {Action, AsyncAction, createNewLesson, setCurrentLesson, setScreen} from './actions';

const defaultState: AppState = {
  screen: Screen.Home,
  lessons: {},
  quiz: {},
  currentLesson: null,
  currentQuestion: null,
  kanjiMode: WordElementMode.Hide,
  meaningMode: WordElementMode.Show,
  readingMode: WordElementMode.Ask
};

export type AppStore = Store<AppState, Action> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  constructor(readonly _dict: JTDict) {}

  private readonly store: AppStore = createStore(
    new AllReducer().japaneseTrainer,
    defaultState,
    applyMiddleware(thunk)
  ) as AppStore;

  readonly state = rxjs.from(this.store);

  readonly keyChange = (key: keyof AppState): rxjs.Observable<AppState> =>
    this.state.pipe(rxjs.distinctUntilKeyChanged(key));

  readonly setCurrentLesson = (lessonId: LessonId) =>
    this.store.dispatch(setCurrentLesson(lessonId));

  readonly createNewLesson = () =>
    this.store.dispatch(createNewLesson());

  readonly setScreen = (screen: Screen) =>
    this.store.dispatch(setScreen(screen));

}
