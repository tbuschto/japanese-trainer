import {ThunkAction} from 'redux-thunk';
import {AppState, Lesson, LessonId, Lessons, Screen} from './types';

export enum ActionType {
  SetCurrentLesson = 'SET_CURRENT_LESSON',
  SetLessons = 'SET_LESSONS',
  NewLesson = 'NEW_LESSON',
  SetScreen = 'SET_SCREEN'
}

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type SetCurrentLesson = ActionBase<typeof ActionType.SetCurrentLesson, LessonId>;
type SetScreen = ActionBase<typeof ActionType.SetScreen, Screen>;
type SetLessons = ActionBase<typeof ActionType.SetLessons, Lessons>;

export type Action = SetCurrentLesson
  | SetScreen
  | SetLessons;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R,
  AppState,
  void,
  Action
>;

type CThunk = () => ThunkAction<void, AppState, void, Action>;
type CAction<T> = (payload: T) => Action;

export const setCurrentLesson: CAction<LessonId> = payload =>
  ({type: ActionType.SetCurrentLesson, payload});

export const setScreen: CAction<Screen> = payload =>
  ({type: ActionType.SetScreen, payload});

export const createNewLesson: CThunk = () => (dispatch, getState) => {
  const state = getState();
  const lastId = Object.keys(state.lessons)
    .map(id => parseInt(id, 10))
    .reduce((a, b) => Math.max(a, b), 0);
  const id = (lastId + 1).toString();
  const lesson: Lesson = {
    name: 'Lesson ' + id,
    content: []
  };
  dispatch(action(ActionType.SetLessons, {[id]: lesson, ...state.lessons}));
  dispatch(action(ActionType.SetCurrentLesson, id));
};

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
