import {push} from 'connected-react-router';
import {CallHistoryMethodAction} from 'connected-react-router';
import {ThunkAction} from 'redux-thunk';
import {AppState, Lesson, LessonId, Lessons, Quiz, RootPath} from './types';
import {lesson} from './views';

export enum ActionType {
  SetCurrentLesson = 'SET_CURRENT_LESSON',
  SetLessons = 'SET_LESSONS',
  NewLesson = 'NEW_LESSON',
  SetScreen = 'SET_SCREEN',
  SetQuiz = 'SET_QUIZ',
  SetEditLesson = 'EDIT_LESSON',
  SetHint = 'SET_HINT'
}

type ActionBase<T extends string, Payload = void> = {type: T, payload?: Payload};
type SetCurrentLesson = ActionBase<typeof ActionType.SetCurrentLesson, LessonId>;
type SetLessonName = ActionBase<typeof ActionType.SetEditLesson, LessonId>;
type SetLessons = ActionBase<typeof ActionType.SetLessons, Lessons>;
type SetHint = ActionBase<typeof ActionType.SetHint, string>;
type SetQuiz = ActionBase<typeof ActionType.SetQuiz, Quiz>;

export type Action = SetCurrentLesson
  | CallHistoryMethodAction
  | SetLessonName
  | SetHint
  | SetQuiz
  | SetLessons;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R,
  AppState,
  void,
  Action
>;

type CThunk<T = void> = (arg: T) => ThunkAction<void, AppState, void, Action>;
type CAction<T> = (payload: T) => Action;

export const setCurrentLesson: CAction<LessonId> = payload =>
  ({type: ActionType.SetCurrentLesson, payload});

export const setScreen: CAction<RootPath> = payload =>
  push(payload)

export const setHint: CAction<string> = payload =>
  ({type: ActionType.SetHint, payload});

export const createNewLesson: CThunk = () => (dispatch, getState) => {
  const state = getState();
  const lastId = Object.keys(state.lessons)
    .map(id => parseInt(id, 10))
    .reduce((a, b) => Math.max(a, b), 0);
  const id = (lastId + 1).toString();
  const lesson: Lesson = {
    name: 'Lesson ' + id,
    questions: []
  };
  dispatch(action(ActionType.SetLessons, {[id]: lesson, ...state.lessons}));
  dispatch(action(ActionType.SetCurrentLesson, id));
  dispatch(push(RootPath.Rename));
};

export const setLessonName: CThunk<string> = name => dispatch => {
  dispatch(setLessonProperty({name}));
  dispatch(push(RootPath.Edit));
};

export const startQuiz: CThunk<string> = () => (dispatch, getState) => {
  dispatch(action(ActionType.SetQuiz, {
    correct: lesson(getState()).questions.map(() => false)
  }));
  dispatch(push(RootPath.Quiz));
};

export const setLessonProperty: CThunk<Partial<Lesson>> = payload =>
  (dispatch, getState) => {
    const {currentLesson, lessons} = getState();
    const updatedLesson = {...lesson(getState()), ...payload};
    dispatch(action(ActionType.SetLessons, {...lessons, [currentLesson || '']: updatedLesson}));
  };

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
