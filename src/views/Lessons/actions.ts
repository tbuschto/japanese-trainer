import {push} from 'connected-react-router';
import {ActionType, CAction, CThunk} from '../../app/Action';
import {setProperty} from '../../app/actions';
import {Lesson, LessonId, RootPath} from '../../app/AppState';
import {selectCurrentLesson} from '../../app/selectors';
import {editName} from '../Edit/actions';

export const createNewLesson: CThunk = () => (dispatch, getState) => {
  const state = getState();
  const lastId = Object.keys(state.lessons)
    .map(id => parseInt(id, 10))
    .reduce((a, b) => Math.max(a, b), 0);
  const id = (lastId + 1).toString();
  const newLesson: Lesson = {
    name: 'Lesson ' + id,
    cards: []
  };
  dispatch(setProperty('lessons', {[id]: newLesson, ...state.lessons}));
  dispatch(setProperty('currentLesson', id));
  dispatch(push(RootPath.Edit));
  dispatch(editName());
  dispatch(setProperty('inputLessonName', ''));
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

export const setupQuiz: CThunk<string> = () => (dispatch, getState) => {
  dispatch(setProperty('quiz', {
    correct: selectCurrentLesson(getState())!.cards.map(() => false)
  }));
  dispatch(push(RootPath.Quiz));
};
