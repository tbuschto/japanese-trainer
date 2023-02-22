import KuroShiro from 'kuroshiro';
import {selectCardHasChanged, selectCurrentCardLessonIndex, selectCurrentEditCard, selectEditCardIsValid} from './editSelectors';
import {actionCreators as actionCreators, Dispatch, GetState, setLessonProperty, setProperty} from '../../app/Action';
import {Candidate, Card, HTMLId, JTDictReadingInfo} from '../../app/AppState';
import {generateId, selectCurrentLesson, selectCurrentLessonCards, selectMatchingCard, selectSelectedSuggestion} from '../../app/selectors';
import {worker} from '../../worker';
import {toSemicolonList, fromSemicolonList} from '../../app/util';
import {isCardDeck} from '../../app/guards';

const {hasKanji} = KuroShiro.Util;

export const actions = actionCreators({

  editNewCard: () => (dispatch: Dispatch, _getState: GetState) => {
    dispatch(actions.editCard({}));
  },

  nextCard: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const index = selectCurrentCardLessonIndex(state);
    const cards = selectCurrentLessonCards(state);
    const newIndex = Math.min(cards.length - 1, index + 1);
    dispatch(actions.editCard(selectCurrentLessonCards(state)[newIndex]));
  },

  prevCard: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const index = selectCurrentCardLessonIndex(state);
    const newIndex = Math.max(0, index - 1);
    dispatch(actions.editCard(selectCurrentLessonCards(state)[newIndex]));
  },

  deleteCard: (index: number) => (dispatch: Dispatch, getState: GetState) => {
    const lesson = selectCurrentLesson(getState());
    if (!isCardDeck(lesson)) {
      return;
    }
    const lessonCards = lesson.cards.concat();
    lessonCards.splice(index, 1);
    dispatch(setLessonProperty({cards: lessonCards}));
  },

  editCard: ({id}: Partial<Card>) => (dispatch: Dispatch, getState: GetState) => {
    dispatch(setProperty('editingTarget', {cardId: id || null}));
    const card = selectCurrentEditCard(getState());
    dispatch(setProperty('editReading', card?.reading || ''));
    dispatch(setProperty('editTranslation', toSemicolonList(card?.meaning || [])));
    dispatch(setProperty('editJapanese', card?.japanese || ''));
    dispatch(setProperty('focus', HTMLId.EditJapanese));
    dispatch(setProperty('suggestions', []));
  },

  saveEdit: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const {editingTarget} = state;
    const cards = {...state.cards};
    if (typeof editingTarget === 'string') throw new Error('Editing target is not a card');
    const candidate: Candidate = {
      japanese: state.editJapanese,
      reading: state.editReading,
      meaning: fromSemicolonList(state.editTranslation)
    };
    const oldCard = selectCurrentEditCard(state);
    const matchingCard = selectMatchingCard(candidate)(state);
    if (oldCard && matchingCard && (oldCard !== matchingCard)) {
      console.error('TODO: Inform user card already exists');
      return;
    }
    const card: Card = {
      id: oldCard?.id || matchingCard?.id || generateId(cards),
      ...candidate
    };
    cards[card.id] = card;
    dispatch(setProperty('cards', cards));
    dispatch(actions.cancelEdit());
    const lesson = selectCurrentLesson(state);
    if (isCardDeck(lesson) && lesson.cards.indexOf(card.id) === -1) {
      dispatch(setLessonProperty({cards: lesson.cards.concat(card.id)}));
      dispatch(actions.editNewCard());
    }
  },

  cancelEdit: () => (dispatch: Dispatch) => {
    dispatch(setProperty('editReading', ''));
    dispatch(setProperty('editTranslation', ''));
    dispatch(setProperty('editJapanese', ''));
    dispatch(setProperty('editingTarget', 'none'));
    dispatch(setProperty('focus', ''));
  },

  editName: () => (dispatch: Dispatch, getState: GetState) => {
    const lesson = selectCurrentLesson(getState());
    if (!lesson) {
      return;
    }
    dispatch(setProperty('editingTarget', 'name'));
    dispatch(setProperty('inputLessonName', lesson.name));
  },

  acceptInputLessonName: () => (dispatch: Dispatch, getState: GetState) => {
    const value = getState().inputLessonName;
    if (!value) {
      return;
    }
    dispatch(setLessonProperty({name: value}));
    dispatch(setProperty('editingTarget', 'none'));
  },

  autoFill: () => async (dispatch: Dispatch) => {
    await dispatch(actions.autoFillReading());
    await dispatch(actions.autoFillTranslation());
  },

  autoFillReading: () => async (dispatch: Dispatch, getState: GetState) => {
    const {editJapanese, editReading} = getState();
    if (editReading || !editJapanese || !hasKanji(editJapanese)) {
      return;
    }
    const reading = await worker.toHiragana(editJapanese);
    const state = getState();
    if (editJapanese === state.editJapanese && !state.editReading) {
      dispatch(setProperty('editReading', reading));
    }
  },

  autoFillTranslation: () => async (dispatch: Dispatch, getState: GetState) => {
    const {editJapanese, editReading, editTranslation} = getState();
    const japanese = editJapanese || editReading;
    if (editTranslation || !japanese) {
      return;
    }
    const entries = hasKanji(japanese)
      ? await worker.findByKanji(japanese)
      : await worker.findByReading(japanese);
    const state = getState();
    if (
      entries.length
      && (editJapanese === state.editJapanese)
      && !state.editTranslation
    ) {
      if (state.editReading && entries.length > 1) {
        const matches = entries.filter(entry => entry.reading === state.editReading);
        dispatch(
          setProperty('editTranslation', topReadings(matches.length > 0 ? matches : entries))
        );
      } else {
        dispatch(setProperty('editTranslation', topReadings(entries)));
      }
    }
  },

  updateSuggestions: () => async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const results = hasKanji(state.editJapanese)
      ? await worker.startsWithKanji(state.editJapanese)
      : await worker.startsWithReading(state.editJapanese);
    const candidates = results.flatMap(
      ({kanji, reading, meaning}): Candidate | Candidate[] => kanji?.length
        ? kanji.map(japanese => ({japanese, reading, meaning}))
        : {japanese: reading, meaning}
    ).map(candidate => selectMatchingCard(candidate)(state) || candidate);
    if (getState().editJapanese === state.editJapanese) {
      dispatch(setProperty('suggestions', candidates));
      dispatch(setProperty('suggestionsSelection', 0));
    }
  },

  acceptSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const card = selectSelectedSuggestion(getState());
    if (card) {
      dispatch(actions.fillDictEntry(card));
    }
  },

  focusNextAction: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const cardHasChanged = selectCardHasChanged(state);
    const cardIsValid = selectEditCardIsValid(state);
    if (cardHasChanged && cardIsValid) {
      dispatch(setProperty('focus', HTMLId.SaveCardEdit));
    } else if (!cardHasChanged) {
      dispatch(setProperty('focus', HTMLId.CancelCardEdit));
    }
  },

  fillDictEntry: (candidate: Candidate) => (dispatch: Dispatch) => {
    dispatch(setProperty('editJapanese', candidate.japanese));
    dispatch(setProperty('editReading', candidate.reading || ''));
    dispatch(setProperty('editTranslation', candidate.meaning.join('; ')));
  },

  selectPreviousSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const newSelection = Math.max(0, getState().suggestionsSelection - 1);
    dispatch(setProperty('suggestionsSelection', newSelection));
  },

  selectNextSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const {suggestions, suggestionsSelection} = getState();
    const newSelection = Math.max(0, Math.min(suggestions.length - 1, suggestionsSelection + 1));
    dispatch(setProperty('suggestionsSelection', newSelection));
  }
});

function topReadings(readings: JTDictReadingInfo[]) {
  return readings.slice(0, 3).map(info => info.meaning).join(', ');
}

export function topMeanings(candidate: Candidate) {
  return candidate.meaning.slice(0, 3).join(', ');
}
