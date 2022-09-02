import _ from 'underscore';
import {AppState, defaults, Lesson} from './AppState';

export const selectLesson = (id: string) => ({lessons}: AppState) => lessons[id];

export const selectCards = (state: AppState) => selectCurrentLesson(state)?.cards || [];

export const selectLessonNames = ({lessons}: AppState) =>
  Object.keys(lessons).sort();

export const selectCurrentLesson = ({currentLesson: currentLesson, lessons}: AppState): Lesson | null => {
  if (!currentLesson) {
    return null;
  }
  return lessons[currentLesson];
};

export const selectCurrentQuizCard = (state: AppState) => {
  if (!state.currentLesson) {
    return null;
  }
  const lesson = state.lessons[state.currentLesson];
  const qIndex = state.currentQuizCard || 0;
  return lesson.cards[qIndex];
};

export const selectCurrentEditCard = (state: AppState) => {
  const {currentLesson, lessons, editingTarget} = state;
  if (!currentLesson || typeof editingTarget !== 'number') {
    return null;
  }
  const lesson = lessons[currentLesson];
  return lesson.cards[editingTarget];
};

export const selectEditCardIsValid = (state: AppState) =>
  !!(state.editTranslation && state.editJapanese);

export const selectEditCardIsEmpty = (state: AppState) =>
  !(state.editTranslation || state.editJapanese || state.editReading);

export const selectCardIsNew = (state: AppState) =>
  selectCurrentLesson(state)?.cards.length === state.editingTarget;

export const selectHasNextCard = (state: AppState) => {
  const lesson = selectCurrentLesson(state);
  const index = state.editingTarget;
  return (!!lesson) && (typeof index === 'number') && (index < lesson.cards.length - 1);
};

export const selectHasPrevCard = (state: AppState) => {
  const lesson = selectCurrentLesson(state);
  const index = state.editingTarget;
  return (!!lesson) && (typeof index === 'number') && (index > 0);
};

export const selectCardHasChanged = (state: AppState) => {
  const card = selectCurrentEditCard(state);
  return !card
    || state.editJapanese !== card.japanese
    || state.editReading !== (card.reading || '')
    || state.editTranslation !== card.translation;
};

export function generateId(ids: string[]) {
  const lastId = ids.map(id => parseInt(id, 10))
    .map(index => isNaN(index) ? 0 : index)
    .reduce((a, b) => Math.max(a, b), 0);
  if (isNaN(lastId)) {
    throw new Error('Failed to generate id');
  }
  return (lastId + 1).toString();
}

export type Selector<T extends keyof AppState> = (state: AppState) => AppState[T];
type SelectorDict = Readonly<{[T in keyof AppState]: Selector<T>}>;

export const select = _(defaults).mapObject(
  (value, key) => makeSelector(key as keyof AppState, value)
) as SelectorDict ;

function makeSelector<T extends keyof AppState>(prop: T, def: AppState[T]): Selector<T> {
  return (state: AppState) => state[prop] === undefined ? def : state[prop];
}
