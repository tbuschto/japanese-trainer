import {AppState, WordElementMode} from 'core';
import {combineReducers, Reducer} from 'redux';
import {Action, ActionType} from './actions';
import {Screen} from './types';

export class AllReducer {

  readonly japaneseTrainer = combineReducers<AppState, Action>(
    {
      screen: setter(ActionType.SetScreen, Screen.Home),
      lessons: setter(ActionType.SetLessons, {}),
      quiz: state => state || null,
      currentLesson: setter(ActionType.SetCurrentLesson, null),
      currentQuestion: state => state || null,
      kanjiMode: state => state || WordElementMode.Hide,
      meaningMode: state => state || WordElementMode.Ask,
      readingMode: state => state || WordElementMode.Show
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
