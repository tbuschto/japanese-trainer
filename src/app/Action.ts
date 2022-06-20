import {CallHistoryMethodAction} from 'connected-react-router';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppState, EditingTarget, LessonId, Lessons, Quiz} from './AppState';

export enum ActionType {
  SetCurrentLesson = 'SET_CURRENT_LESSON',
  SetLessons = 'SET_LESSONS',
  NewLesson = 'NEW_LESSON',
  SetScreen = 'SET_SCREEN',
  SetQuiz = 'SET_QUIZ',
  SetEditLesson = 'EDIT_LESSON',
  SetHint = 'SET_HINT',
  SetEditingTarget = 'SET_EDITING_TARGET',
  SetEditingValue = 'SET_EDITING_VALUE'
}

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type SetCurrentLesson = ActionBase<typeof ActionType.SetCurrentLesson, LessonId>;
type SetLessonName = ActionBase<typeof ActionType.SetEditLesson, LessonId>;
type SetLessons = ActionBase<typeof ActionType.SetLessons, Lessons>;
type SetEditingTarget = ActionBase<typeof ActionType.SetEditingTarget, EditingTarget>;
type SetEditingValue = ActionBase<typeof ActionType.SetEditingValue, string>;
type SetHint = ActionBase<typeof ActionType.SetHint, string>;
type SetQuiz = ActionBase<typeof ActionType.SetQuiz, Quiz>;

export type SyncAction = SetCurrentLesson |
  CallHistoryMethodAction |
  SetLessonName |
  SetEditingTarget |
  SetEditingValue |
  SetHint |
  SetQuiz |
  SetLessons;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R, AppState, void, SyncAction
>;

export type Dispatch = ThunkDispatch<AppState, void, SyncAction>;
export type CThunk<T = void> = (arg: T) => ThunkAction<void, AppState, void, SyncAction>;
export type CAction<T> = (payload: T) => SyncAction;

export type Action = SyncAction | AsyncAction;
