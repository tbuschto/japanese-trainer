import KuroShiro from 'kuroshiro';
import {selectCardHasChanged, selectCardIsNew, selectCurrentEditCard, selectEditCardIsValid} from './editSelectors';
import {actionCreators as actionCreators, Dispatch, GetState, setLessonProperty, setProperty} from '../../app/Action';
import {Card, HTMLId, JTDictReadingInfo} from '../../app/AppState';
import {generateId, selectCards, selectCurrentLesson, selectSelectedSuggestion} from '../../app/selectors';
import {worker} from '../../worker';
import {toSemicolonList, fromSemicolonList} from '../../app/util';

const {hasKanji} = KuroShiro.Util;

export const actions = actionCreators({

  newCard: () => (dispatch: Dispatch, getState: GetState) => {
    const cards = selectCurrentLesson(getState())!.cards!;
    dispatch(actions.editCard(cards.length));
  },

  nextCard: () => (dispatch: Dispatch, getState: GetState) => {
    dispatch(actions.editCard(getState().editingTarget as number + 1));
  },

  prevCard: () => (dispatch: Dispatch, getState: GetState) => {
    dispatch(actions.editCard(getState().editingTarget as number - 1));
  },

  deleteCard: (index: number) => (dispatch: Dispatch, getState: GetState) => {
    const lesson = selectCurrentLesson(getState());
    if (!lesson) {
      return;
    }
    const lessonCards = lesson.cards.concat();
    lessonCards.splice(index, 1);
    dispatch(setLessonProperty({cards: lessonCards}));
  },

  editCard: (index: number) => (dispatch: Dispatch, getState: GetState) => {
    dispatch(setProperty('editingTarget', index));
    const card = selectCurrentEditCard(getState());
    dispatch(setProperty('editReading', card?.reading || ''));
    dispatch(setProperty('editTranslation', toSemicolonList(card?.meaning || [])));
    dispatch(setProperty('editJapanese', card?.japanese || ''));
    dispatch(setProperty('focus', HTMLId.EditJapanese));
    dispatch(setProperty('suggestions', []));
  },

  saveEdit: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const {editingTarget, cards} = state;
    if (typeof editingTarget !== 'number') throw new Error('Editing target is not a card');
    const lesson = selectCurrentLesson(state);
    const cardIsNew = selectCardIsNew(state);
    if (!lesson) throw new Error('No lesson selected');
    const lessonCards = lesson.cards.concat();
    const oldCard = selectCards(state)[editingTarget] as Card | undefined;
    const card: Card = {
      id: oldCard?.id || generateId(lessonCards),
      japanese: state.editJapanese,
      reading: state.editReading,
      meaning: fromSemicolonList(state.editTranslation)
    };
    lessonCards[editingTarget] = card.id;
    cards[card.id] = card;
    dispatch(setLessonProperty({cards: lessonCards}));
    dispatch(actions.cancelEdit());
    if (cardIsNew) {
      dispatch(actions.newCard());
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
    const {editJapanese} = getState();
    const results = hasKanji(editJapanese)
      ? await worker.startsWithKanji(editJapanese)
      : await worker.startsWithReading(editJapanese);
    if (getState().editJapanese === editJapanese) {
      dispatch(setProperty('suggestions', results));
      dispatch(setProperty('suggestionsSelection', 0));
    }
  },

  acceptSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const info = selectSelectedSuggestion(getState());
    if (info) {
      dispatch(actions.fillDictEntry(info));
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

  fillDictEntry: (info: JTDictReadingInfo) => (dispatch: Dispatch) => {
    const kanji = info.kanji?.join(', ');
    const japanese = kanji || info.reading;
    const reading = kanji ? info.reading : '';
    dispatch(setProperty('editJapanese',japanese));
    dispatch(setProperty('editReading', reading));
    dispatch(setProperty('editTranslation', topMeanings(info)));
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

export function topMeanings(info: JTDictReadingInfo) {
  return info.meaning.slice(0, 3).join(', ');
}
