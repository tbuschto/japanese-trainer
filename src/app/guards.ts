import {CardDeck, CardCollection, Lesson} from './AppState';

export function isCardDeck(lesson: Lesson | null): lesson is CardDeck {
  return !!lesson && ('cards' in lesson);
}

export function isCardCollection(lesson: Lesson | null): lesson is CardCollection {
  return !!lesson && ('filter' in lesson);
}
