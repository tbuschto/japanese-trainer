import {push} from 'connected-react-router';
import {CAction, ActionType, CThunk, SetPropertyAction} from './Action';
import {AppState, Card, EditingTarget, Lesson, LessonId, RootPath} from './AppState';
import {selectCardIsNew, selectCards, selectCurrentEditCard, selectCurrentLesson} from './selectors';

export const newCard: CThunk = () => (dispatch, getState) => {
  const cards = selectCurrentLesson(getState())!.cards!;
  dispatch(setEditingTarget(cards.length));
  dispatch(setProperty('focus', 'editJapanese'));
};

export const deleteCard: CThunk<number> = (index: number) => (dispatch, getState) => {
  const cards = selectCards(getState()).concat();
  cards.splice(index, 1);
  dispatch(setLessonProperty({cards}));
};

export const editCard: CThunk<number> = (index: number) => (dispatch, getState) => {
  dispatch(setEditingTarget(index));
  const card = selectCurrentEditCard(getState());
  dispatch(setProperty('editReading', card?.reading || ''));
  dispatch(setProperty('editTranslation', card?.translation || ''));
  dispatch(setProperty('editJapanese', card?.japanese || ''));
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

export const saveEdit: CThunk = () => (dispatch, getState) => {
  const state = getState();
  const {editingTarget} = state;
  if (typeof editingTarget !== 'number') throw new Error('Editing target is not a card');
  const lesson = selectCurrentLesson(state);
  const cardIsNew = selectCardIsNew(state);
  if (!lesson) throw new Error('No lesson selected');
  const cards = lesson.cards.concat();
  const card: Card = {};
  card.japanese = state.editJapanese;
  card.reading = state.editReading;
  card.translation = state.editTranslation;
  cards[editingTarget] = card;
  dispatch(setLessonProperty({cards}));
  dispatch(cancelEdit());
  if (cardIsNew) {
    dispatch(newCard());
  }
};

export const cancelEdit: CThunk = () => dispatch => {
  dispatch(setProperty('editReading', ''));
  dispatch(setProperty('editTranslation', ''));
  dispatch(setProperty('editJapanese', ''));
  dispatch(setEditingTarget('none'));
  dispatch(setProperty('focus', ''));
};

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
    cards: []
  };
  dispatch(setProperty('lessons', {[id]: newLesson, ...state.lessons}));
  dispatch(setProperty('currentLesson', id));
  dispatch(push(RootPath.Edit));
  dispatch(editName());
  dispatch(setProperty('inputLessonName', ''));
};

export const acceptInputLessonName: CThunk = () => (dispatch, getState) => {
  const value = getState().inputLessonName;
  if (!value) {
    return;
  }
  dispatch(setLessonProperty({name: value}));
  dispatch(setEditingTarget('none'));
};

export const startQuiz: CThunk<string> = () => (dispatch, getState) => {
  dispatch(setProperty('quiz', {
    correct: selectCurrentLesson(getState())!.cards.map(() => false)
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

export function setProperty<
  Property extends keyof AppState,
  Value extends AppState[Property] = AppState[Property]
>(property: Property, value: Value): SetPropertyAction {
  return action(ActionType.SetProperty, {property, value});
}

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
