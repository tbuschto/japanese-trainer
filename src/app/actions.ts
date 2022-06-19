import {push, CallHistoryMethodAction} from 'connected-react-router';
import {FormEvent} from 'react';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppState, EditingTarget, Lesson, LessonId, Lessons, Quiz, RootPath} from './AppState';
import {selectLesson} from './selectors';

export enum ActionType {
  SetCurrentLesson = 'SET_CURRENT_LESSON',
  SetLessons = 'SET_LESSONS',
  NewLesson = 'NEW_LESSON',
  SetScreen = 'SET_SCREEN',
  SetQuiz = 'SET_QUIZ',
  SetEditLesson = 'EDIT_LESSON',
  SetHint = 'SET_HINT',
  SetEditingTarget = 'SET_EDITING_TARGET',
  SetEditingValue = 'SET_EDITING_VALUE',
}

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type SetCurrentLesson = ActionBase<typeof ActionType.SetCurrentLesson, LessonId>;
type SetLessonName = ActionBase<typeof ActionType.SetEditLesson, LessonId>;
type SetLessons = ActionBase<typeof ActionType.SetLessons, Lessons>;
type SetEditingTarget = ActionBase<typeof ActionType.SetEditingTarget, EditingTarget>;
type SetEditingValue = ActionBase<typeof ActionType.SetEditingValue, string>;
type SetHint = ActionBase<typeof ActionType.SetHint, string>;
type SetQuiz = ActionBase<typeof ActionType.SetQuiz, Quiz>;

export type SyncAction = SetCurrentLesson
  | CallHistoryMethodAction
  | SetLessonName
  | SetEditingTarget
  | SetEditingValue
  | SetHint
  | SetQuiz
  | SetLessons;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R,
  AppState,
  void,
  SyncAction
>;

export type Dispatch = ThunkDispatch<AppState, void, SyncAction>;

type CThunk<T = void> = (arg: T) => ThunkAction<void, AppState, void, SyncAction>;
type CAction<T> = (payload: T) => SyncAction;

export type Action = SyncAction | AsyncAction;

export const setCurrentLesson: CAction<LessonId> = payload =>
  ({type: ActionType.SetCurrentLesson, payload});

export const cancelEdit = () => setEditingTarget('none');

export const editName: CThunk = () => (dispatch, getState) => {
  const lesson = selectLesson(getState());
  if (!lesson) {
    return;
  }
  dispatch(setEditingTarget('name'));
  dispatch(setEditingValue(lesson.name));
};

export const setEditingTarget: CAction<EditingTarget> = payload =>
  ({type: ActionType.SetEditingTarget, payload});

export const setScreen: CAction<RootPath> = payload =>
  push(payload);

export const setHint: CAction<string> = payload =>
  ({type: ActionType.SetHint, payload});

export const createNewLesson: CThunk = () => (dispatch, getState) => {
  const state = getState();
  const lastId = Object.keys(state.lessons)
    .map(id => parseInt(id, 10))
    .reduce((a, b) => Math.max(a, b), 0);
  const id = (lastId + 1).toString();
  const newLesson: Lesson = {
    name: 'Lesson ' + id,
    questions: []
  };
  dispatch(action(ActionType.SetLessons, {[id]: newLesson, ...state.lessons}));
  dispatch(action(ActionType.SetCurrentLesson, id));
  dispatch(push(RootPath.Edit));
  dispatch(editName());
  dispatch(setEditingValue(''));
};

export const handleInput = (dispatch: Dispatch) =>
  (ev: FormEvent<HTMLInputElement>) => dispatch(setEditingValue(ev.currentTarget.value));

export const acceptInput: CThunk = () => (dispatch, getState) => {
  const value = getState().editingValue;
  if (!value) {
    return;
  }
  dispatch(setLessonProperty({name: value}));
  dispatch(setEditingTarget('none'));
};

export const setEditingValue: CThunk<string> = value => dispatch => {
  dispatch(action(ActionType.SetEditingValue, value));
};

export const startQuiz: CThunk<string> = () => (dispatch, getState) => {
  dispatch(action(ActionType.SetQuiz, {
    correct: selectLesson(getState())!.questions.map(() => false)
  }));
  dispatch(push(RootPath.Quiz));
};

export const setLessonProperty: CThunk<Partial<Lesson>> = payload =>
  (dispatch, getState) => {
    const {currentLesson, lessons} = getState();
    const oldLesson = selectLesson(getState());
    if (!oldLesson) {
      throw new Error('No lesson to set property');
    }
    const updatedLesson: Lesson = {...oldLesson, ...payload};
    dispatch(action(ActionType.SetLessons, {...lessons, [currentLesson || '']: updatedLesson}));
  };

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
