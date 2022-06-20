import {push} from 'connected-react-router';
import {FormEvent} from 'react';
import {CAction, ActionType, CThunk, Dispatch} from './Action';
import {EditingTarget, Lesson, LessonId, RootPath} from './AppState';
import {selectCurrentLesson} from './selectors';

export const newQuiz: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setCurrentLesson(lessonId));
  dispatch(action(ActionType.SetQuiz, {correct: []}));
  dispatch(push(RootPath.Quiz));
};

export const editLesson: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setCurrentLesson(lessonId));
  dispatch(push(RootPath.Edit));
};

export const deleteLesson: CThunk<string> = (lessonId: string) => (dispatch, getState) => {
  const lessons = {...getState().lessons};
  delete lessons[lessonId];
  dispatch(action(ActionType.SetLessons, lessons));
};

export const setCurrentLesson: CAction<LessonId> = payload =>
  ({type: ActionType.SetCurrentLesson, payload});

export const cancelEdit = () => setEditingTarget('none');

export const editName: CThunk = () => (dispatch, getState) => {
  const lesson = selectCurrentLesson(getState());
  if (!lesson) {
    return;
  }
  dispatch(setEditingTarget('name'));
  dispatch(setEditingValue(lesson.name));
};

export const setEditingTarget: CAction<EditingTarget> = payload =>
  ({type: ActionType.SetEditingTarget, payload});

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
    correct: selectCurrentLesson(getState())!.questions.map(() => false)
  }));
  dispatch(push(RootPath.Quiz));
};

export const setLessonProperty: CThunk<Partial<Lesson>> = payload =>
  (dispatch, getState) => {
    const {currentLesson, lessons} = getState();
    const oldLesson = selectCurrentLesson(getState());
    if (!oldLesson) {
      throw new Error('No lesson to set property');
    }
    const updatedLesson: Lesson = {...oldLesson, ...payload};
    dispatch(action(ActionType.SetLessons, {...lessons, [currentLesson || '']: updatedLesson}));
  };

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
