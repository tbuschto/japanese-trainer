import Kuroshiro from 'kuroshiro';
import {AppState, Card} from '../../app/AppState';
import {selectCurrentLessonCards, selectCard} from '../../app/selectors';
import {toSemicolonList} from '../../app/util';

const {hasJapanese, isKana} = Kuroshiro.Util;
const hasRomaji = (str: string) => /[a-zA-Z]/.test(str);
const jMisc = '、,。ー！？・　 '.split('');

export const selectCurrentEditCard = (state: AppState) => {
  const {editingTarget} = state;
  if (typeof editingTarget === 'string') {
    return null;
  }
  return selectCard(editingTarget)(state);
};

export const selectHasNextCard = (state: AppState) => {
  const cards = selectCurrentLessonCards(state);
  const index = selectCurrentCardLessonIndex(state);
  return index < cards.length - 1;
};

export const selectHasPrevCard = (state: AppState) => {
  const index = selectCurrentCardLessonIndex(state);
  return index > 0;
};

export const selectCardHasChanged = (state: AppState) => {
  const card = selectCurrentEditCard(state);
  return !card
    || state.editJapanese !== card.japanese
    || state.editReading !== (card.reading || '')
    || state.editTranslation !== toSemicolonList(card.meaning);
};

export const selectJapaneseValidationError = ({editJapanese: text}: AppState): string => {
  if (!text) {
    return '';
  }
  if (hasRomaji(text)) {
    return 'Non-japanese characters';
  }
  if (!hasJapanese(text)) {
    return 'No japanese characters';
  }
  return '';
};

export const selectReadingValidationError = ({editReading: text}: AppState): string => {
  if (!text.split('').every(char => isKana(char) || jMisc.includes(char))) {
    return 'Only kana allowed';
  }
  return '';
};

export const selectTranslationValidationError = ({editTranslation: text}: AppState): string => {
  if (!text) {
    return '';
  }
  if (hasJapanese(text)) {
    return 'No japanese characters allowed';
  }
  return '';
};

export const selectEditCardIsValid = (state: AppState): boolean =>
  (!!state.editJapanese && !selectJapaneseValidationError(state))
  && (!state.editReading || !selectReadingValidationError(state))
  && (!!state.editTranslation && !selectTranslationValidationError(state));

export const selectEditCardIsEmpty = (state: AppState) =>
  !(state.editTranslation || state.editJapanese || state.editReading);

export const selectCurrentCardLessonIndex = (state: AppState) => {
  const index = selectCardLessonIndex(selectCurrentEditCard(state))(state);
  if (index < 0) {
    return selectCurrentLessonCards(state).length;
  }
  return index;
};

export const selectCardIsNew = ({editingTarget}: AppState) =>
  (typeof editingTarget === 'object') && !editingTarget.cardId;

const selectCardLessonIndex = (card: Card | null) => (state: AppState) =>
  selectCurrentLessonCards(state).findIndex(({id}) => id === card?.id);
