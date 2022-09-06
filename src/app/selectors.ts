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
