/* eslint-disable prefer-rest-params */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {ThunkAction, ThunkDispatch} from '@reduxjs/toolkit';
import _ from 'underscore';
import {CallHistoryMethodAction} from 'connected-react-router';
import {AppState, Lesson} from './AppState';
import {selectCurrentLesson} from './selectors';
import {groupLog} from './groupLog';

export enum ActionType {
  SetProperty = 'SET_PROPERTY'
}
export type SetPropertyAction<Property extends keyof AppState = keyof AppState, Value = AppState[Property]> = {
  type: ActionType.SetProperty, property: Property, value: Value
};
export type SyncAction = CallHistoryMethodAction | SetPropertyAction;
export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R, AppState, void, SyncAction
>;
export type Dispatch = ThunkDispatch<AppState, void, SyncAction>;
export type CThunk<T = void> = (arg: T) => ThunkAction<void, AppState, void, SyncAction>;
export type CAThunk<T = void> = (arg: T) => ThunkAction<Promise<void>, AppState, void, SyncAction>;
export type CAction<T> = (payload: T) => SyncAction;
export type Action = SyncAction | AsyncAction;
export type Setter<T extends keyof AppState> = (value: AppState[T]) => SyncAction;
export type SetterDict = Readonly<{[T in keyof AppState]: Setter<T>}>;
export type GetState = () => AppState;

export const setLessonProperty: CThunk<Partial<Lesson>> = payload =>
  (dispatch, getState) => {
    const {currentLesson: currentLesson, lessons} = getState();
    const oldLesson = selectCurrentLesson(getState());
    if (!oldLesson) {
      throw new Error('No lesson to set property');
    }
    const updatedLesson: Lesson = {...oldLesson, ...payload};
    dispatch(setProperty('lessons', {...lessons, [currentLesson || '']: updatedLesson}));
  };

export function setProperty<
  Property extends keyof AppState,
  Value extends AppState[Property] = AppState[Property]
>(property: Property, value: Value): SetPropertyAction {
  return {type: ActionType.SetProperty, property, value};
}

export const thunks = <T extends Record<string, Function>>(all: T) => all;

export function actionCreators<T>(obj: T): T {
  for (const key in obj) {
    const member = obj[key];
    if (!(member instanceof Function)) {
      continue;
    }
    obj[key] = (function() {
      const params = Array.from(arguments);
      const innerAction = member.apply(obj, params) as unknown;
      const thunk: ThunkAction<void, AppState, void, SyncAction> = (dispatch, getState) =>
        groupLog([key].concat(params), async () => {
          if (innerAction instanceof Function) {
            const maybePromise = innerAction(dispatch, getState);
            if (maybePromise instanceof Promise) {
              await maybePromise;
            }
          } else {
            dispatch(innerAction as SyncAction);
          }
        });
      return thunk;
    }).bind(obj) as any;
  }
  return obj;
}
