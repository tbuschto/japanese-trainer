import {AppState, JTDict, LessonId, Screen} from 'core';
import {Store} from 'redux';
import {ThunkAction} from 'redux-thunk';

export enum ActionType {
  SetLesson = 'SET_LESSON',
  SetScreen = 'SET_SCREEN'
}

type ActionBase<T extends string, Payload = void> = {type: T, payload: Payload};
type SetLesson = ActionBase<typeof ActionType.SetLesson, LessonId>;
type SetScreen = ActionBase<typeof ActionType.SetScreen, Screen>;

export type Action = SetLesson
  | SetScreen;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R,
  AppState,
  void,
  Action
>;

export function ActionDispatchers({dispatch}: Store<AppState, Action>, _dict: JTDict) {
  return Object.freeze({
    setLesson: (payload: LessonId) => dispatch({type: ActionType.SetLesson, payload}),
    setScreen: (payload: Screen) => dispatch({type: ActionType.SetScreen, payload})
  });
}

export type ActionCreators = ReturnType<typeof ActionDispatchers>;
