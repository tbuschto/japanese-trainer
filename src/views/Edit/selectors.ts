import Kuroshiro from 'kuroshiro';
import {AppState} from '../../app/AppState';
import {selectCurrentLesson} from '../../app/selectors';

const {hasJapanese, isKana} = Kuroshiro.Util;
const hasRomaji = (str: string) => /[a-zA-Z]/.test(str);
const jMisc = '、,。ー！？・　 '.split('');

export const selectCurrentEditCard = (state: AppState) => {
  const {currentLesson, lessons, editingTarget} = state;
  if (!currentLesson || typeof editingTarget !== 'number') {
    return null;
  }
  const lesson = lessons[currentLesson];
  return lesson.cards[editingTarget];
};

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

export const selectCardIsNew = (state: AppState) => selectCurrentLesson(state)?.cards.length === state.editingTarget;
