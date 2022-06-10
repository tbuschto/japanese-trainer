import {connectRouter} from 'connected-react-router';
import {History} from 'history';
import {combineReducers, Reducer} from 'redux';
import {Action, ActionType} from './actions';
import {AppState, RootPath, WordElementMode} from './types';

export class AllReducer {

  constructor(private history: History) {}

  readonly japaneseTrainer = combineReducers<AppState, Action>(
    {
      router: connectRouter(this.history),
      screen: setter(ActionType.SetScreen, RootPath.Home as RootPath),
      lessons: setter(ActionType.SetLessons, {}),
      quiz: state => state || null,
      currentLesson: setter(ActionType.SetCurrentLesson, null as string | null),
      currentQuestion: state => state || 0,
      kanjiMode: state => state || WordElementMode.Hide,
      meaningMode: state => state || WordElementMode.Show,
      readingMode: state => state || WordElementMode.Ask,
      hint: state => state || ''
    }
  );

}

type Setter<T> = Reducer<T, Action>;

function setter<T extends AppState[keyof AppState]>(actionType: ActionType, init: T): Setter<T> {
  return (state, action) => {
    if (action.type === actionType && action.payload) {
      return action.payload as T;
    }
    return state || init;
  };
}
