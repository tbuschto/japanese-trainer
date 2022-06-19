import {connectRouter} from 'connected-react-router';
import {History} from 'history';
import {combineReducers, Reducer} from 'redux';
import {ActionType, SyncAction} from './actions';
import {AppState, EditingTarget, RootPath, WordElementMode} from './AppState';

export function createReducer(history: History) {
  return combineReducers<AppState, SyncAction>(
    {
      router: connectRouter(history),
      screen: setter(ActionType.SetScreen, RootPath.Home as RootPath),
      lessons: setter(ActionType.SetLessons, {}),
      quiz: state => state || null,
      currentLesson: setter(ActionType.SetCurrentLesson, null as string | null),
      currentQuestion: state => state || 0,
      kanjiMode: state => state || WordElementMode.Hide,
      meaningMode: state => state || WordElementMode.Show,
      readingMode: state => state || WordElementMode.Ask,
      hint: state => state || '',
      editingTarget: setter(ActionType.SetEditingTarget, 'none' as EditingTarget),
      editingValue: setter(ActionType.SetEditingValue, '' as string)
    }
  );
}

type Setter<T> = Reducer<T, SyncAction>;

function setter<T extends AppState[keyof AppState]>(actionType: ActionType, init: T): Setter<T> {
  return (state, action) => {
    if (action.type === actionType) {
      return action.payload as T;
    }
    return state || init;
  };
}
