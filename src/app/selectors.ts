import _ from 'underscore';
import {AppState, Candidate, defaults, Lesson} from './AppState';
import {isCardDeck, isCardCollection} from './guards';

export const selectLesson = (id: string) => ({lessons}: AppState) => lessons[id];

export const selectMatchingCard = (candidate: Candidate) => ({cards}: AppState) => {
  const matches = _.values(cards).filter(
    card => card.japanese === candidate.japanese && card.reading === card.reading
  );
  if (matches.length > 1) {
    console.error(`Multiple matches for ${candidate.japanese} indicates inconsistent state`);
  }
  return matches[0] || null;
};

export const selectCurrentLessonCards = (state: AppState) => {
  const lesson = selectCurrentLesson(state);
  if (isCardDeck(lesson)) {
    return lesson.cards.map(id => state.cards[id]) || [];
  } else if (isCardCollection(lesson)) {
    return selectAllCardsOrderedById(state);
  }
  return [];
};

export const selectAllCardsOrderedById = ({cards}: AppState) =>
  Object.keys(cards).sort().map(id => cards[id]);

export const selectCard = ({cardId}: {cardId: string | null}) =>
  (state: AppState) => cardId ? state.cards[cardId] : null;

export const selectLessonNames = ({lessons}: AppState) =>
  Object.keys(lessons).sort();

export const selectCurrentLesson = ({currentLesson: currentLesson, lessons}: AppState): Lesson | null => {
  if (!currentLesson) {
    return null;
  }
  return lessons[currentLesson];
};

export const selectSelectedSuggestion = (state: AppState): Candidate | null => {
  if (state.suggestionsSelection < 0) {
    return null;
  }
  return state.suggestions[state.suggestionsSelection] || null;
};

export function generateId(db: Record<string, unknown>) {
  const ids = Object.keys(db);
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
