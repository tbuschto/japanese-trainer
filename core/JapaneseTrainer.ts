import {AppState, JTDict, Screen, WordElementMode} from 'core';
import {createStore, Store} from 'redux';
import * as rxjs from 'rxjs';
import {Action, ActionDispatchers, AsyncAction} from './ActionCreators';
import {Reducer} from './Reducer';

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

type AppStore = Store<AppState, Action> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R
};

export class JapaneseTrainer {

  constructor(private readonly dict: JTDict) {}

  private readonly store: AppStore = createStore(
    new Reducer().japaneseTrainer,
    defaultState
  ) as AppStore;

  readonly actions = ActionDispatchers(this.store, this.dict);

  readonly state = rxjs.from(this.store);

  keyChange(key: keyof AppState): rxjs.Observable<AppState> {
    return this.state.pipe(rxjs.distinctUntilKeyChanged(key));
  }

}
