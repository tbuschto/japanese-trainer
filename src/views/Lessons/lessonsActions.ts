import {push} from 'connected-react-router';
import {CThunk, setProperty} from '../../app/Action';
import {Lesson, RootPath} from '../../app/AppState';
import {generateId} from '../../app/selectors';
import {actions} from '../Edit/editActions';

export const createNewLesson: CThunk<'cardDeck' | 'cardCollection'> = (type) => (dispatch, getState) => {
  const {lessons} = getState();
  const newId = generateId(lessons);
  const name = 'Lesson ' + newId;
  const newLesson: Lesson = type === 'cardDeck' ? {name, cards: []} : {name, filter: 'none'};
  dispatch(setProperty('lessons', {[newId]: newLesson, ...lessons}));
  dispatch(setProperty('currentLesson', newId));
  dispatch(push(RootPath.Edit));
  dispatch(actions.editName());
  dispatch(setProperty('inputLessonName', ''));
};

export const newQuiz: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setProperty('currentLesson', lessonId));
  dispatch(setProperty('quiz', {correct: []}));
  dispatch(push(RootPath.Quiz));
};

export const editLesson: CThunk<string> = (lessonId: string) => dispatch => {
  dispatch(setProperty('editingTarget', 'none'));
  dispatch(setProperty('currentLesson', lessonId));
  dispatch(push(RootPath.Edit));
};

export const deleteLesson: CThunk<string> = (lessonId: string) => (dispatch, getState) => {
  const lessons = {...getState().lessons};
  delete lessons[lessonId];
  dispatch(setProperty('lessons', lessons));
};

// export const setupQuiz: CThunk<string> = () => (dispatch, getState) => {
//   dispatch(setProperty('quiz', {
//     correct: selectCurrentLesson(getState())!.cards.map(() => false)
//   }));
//   dispatch(push(RootPath.Quiz));
// };
