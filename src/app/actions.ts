import {push} from 'connected-react-router';
import {FormEvent} from 'react';
import {CAction, ActionType, CThunk, Dispatch, SetPropertyAction} from './Action';
import {AppState, EditingTarget, Lesson, LessonId, RootPath} from './AppState';
import {selectCurrentLesson} from './selectors';

export const newQuestion: CThunk = () => (dispatch, getState) => {
  const questions = selectCurrentLesson(getState())!.questions!;
  dispatch(setEditingTarget(questions.length));
};

export const newQuiz: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setCurrentLesson(lessonId));
  dispatch(setProperty('quiz', {correct: []}));
  dispatch(push(RootPath.Quiz));
};

export const editLesson: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setCurrentLesson(lessonId));
  dispatch(push(RootPath.Edit));
};

export const deleteLesson: CThunk<string> = (lessonId: string) => (dispatch, getState) => {
  const lessons = {...getState().lessons};
  delete lessons[lessonId];
  dispatch(setProperty('lessons', lessons));
};

export const setCurrentLesson: CAction<LessonId> = value =>
  ({type: ActionType.SetProperty, payload: {property: 'currentLesson', value}});

export const cancelEdit = () => setEditingTarget('none');

export const editName: CThunk = () => (dispatch, getState) => {
  const lesson = selectCurrentLesson(getState());
  if (!lesson) {
    return;
  }
  dispatch(setEditingTarget('name'));
  dispatch(setProperty('inputLessonName', lesson.name));
};

export const setEditingTarget: CAction<EditingTarget> = value => setProperty('editingTarget', value);

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
  dispatch(setProperty('lessons', {[id]: newLesson, ...state.lessons}));
  dispatch(setProperty('currentLesson', id));
  dispatch(push(RootPath.Edit));
  dispatch(editName());
  dispatch(setProperty('inputLessonName', ''));
};

export const handleNameInput = (dispatch: Dispatch) =>
  (ev: FormEvent<HTMLInputElement>) => dispatch(setProperty('inputLessonName', ev.currentTarget.value));

export const acceptInput: CThunk = () => (dispatch, getState) => {
  const value = getState().inputLessonName;
  if (!value) {
    return;
  }
  dispatch(setLessonProperty({name: value}));
  dispatch(setEditingTarget('none'));
};

export const startQuiz: CThunk<string> = () => (dispatch, getState) => {
  dispatch(setProperty('quiz', {
    correct: selectCurrentLesson(getState())!.questions.map(() => false)
  }));
  dispatch(push(RootPath.Quiz));
};

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

function setProperty<
  Property extends keyof AppState,
  Value extends AppState[Property] = AppState[Property]
>(property: Property, value: Value): SetPropertyAction {
  return action(ActionType.SetProperty, {property, value});
}

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
