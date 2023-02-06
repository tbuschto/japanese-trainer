import KuroShiro from 'kuroshiro';
import {selectCardHasChanged, selectCardIsNew, selectCurrentEditCard, selectEditCardIsValid} from './editSelectors';
import {actionCreators as actionCreators, Dispatch, GetState, set, setLessonProperty} from '../../app/Action';
import {Card, EditingTarget, HTMLId, JTDictReadingInfo} from '../../app/AppState';
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
    const cards = selectCards(getState()).concat();
    cards.splice(index, 1);
    dispatch(setLessonProperty({cards}));
  },

  editCard: (index: number) => (dispatch: Dispatch, getState: GetState) => {
    dispatch(actions.setEditingTarget(index));
    const card = selectCurrentEditCard(getState());
    dispatch(set.editReading(card?.reading || ''));
    dispatch(set.editTranslation(toSemicolonList(card?.meaning || [])));
    dispatch(set.editJapanese(card?.japanese || ''));
    dispatch(set.focus(HTMLId.EditJapanese));
    dispatch(set.suggestions([]));
  },

  saveEdit: () => (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const {editingTarget} = state;
    if (typeof editingTarget !== 'number') throw new Error('Editing target is not a card');
    const lesson = selectCurrentLesson(state);
    const cardIsNew = selectCardIsNew(state);
    if (!lesson) throw new Error('No lesson selected');
    const cards = lesson.cards.concat();
    const oldCard = cards[editingTarget] as Card | undefined;
    const card: Card = {
      id: oldCard?.id || generateId(cards.map(({id}) => id)),
      japanese: state.editJapanese,
      reading: state.editReading,
      meaning: fromSemicolonList(state.editTranslation)
    };
    cards[editingTarget] = card;
    dispatch(setLessonProperty({cards}));
    dispatch(actions.cancelEdit());
    if (cardIsNew) {
      dispatch(actions.newCard());
    }
  },

  cancelEdit: () => (dispatch: Dispatch) => {
    dispatch(set.editReading(''));
    dispatch(set.editTranslation(''));
    dispatch(set.editJapanese(''));
    dispatch(actions.setEditingTarget('none'));
    dispatch(set.focus(''));
  },

  editName: () => (dispatch: Dispatch, getState: GetState) => {
    const lesson = selectCurrentLesson(getState());
    if (!lesson) {
      return;
    }
    dispatch(actions.setEditingTarget('name'));
    dispatch(set.inputLessonName(lesson.name));
  },

  setEditingTarget: (value: EditingTarget) => set.editingTarget(value),

  acceptInputLessonName: () => (dispatch: Dispatch, getState: GetState) => {
    const value = getState().inputLessonName;
    if (!value) {
      return;
    }
    dispatch(setLessonProperty({name: value}));
    dispatch(actions.setEditingTarget('none'));
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
      dispatch(set.editReading(reading));
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
          set.editTranslation(topReadings(matches.length > 0 ? matches : entries))
        );
      } else {
        dispatch(set.editTranslation(topReadings(entries)));
      }
    }
  },

  updateSuggestions: () => async (dispatch: Dispatch, getState: GetState) => {
    const {editJapanese} = getState();
    const results = hasKanji(editJapanese)
      ? await worker.startsWithKanji(editJapanese)
      : await worker.startsWithReading(editJapanese);
    if (getState().editJapanese === editJapanese) {
      dispatch(set.suggestions(results));
      dispatch(set.suggestionsSelection(0));
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
      dispatch(set.focus(HTMLId.SaveCardEdit));
    } else if (!cardHasChanged) {
      dispatch(set.focus(HTMLId.CancelCardEdit));
    }
  },

  fillDictEntry: (info: JTDictReadingInfo) => (dispatch: Dispatch) => {
    const kanji = info.kanji?.join(', ');
    const japanese = kanji || info.reading;
    const reading = kanji ? info.reading : '';
    dispatch(set.editJapanese(japanese));
    dispatch(set.editReading(reading));
    dispatch(set.editTranslation(topMeanings(info)));
  },

  selectPreviousSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const newSelection = Math.max(0, getState().suggestionsSelection - 1);
    dispatch(set.suggestionsSelection(newSelection));
  },

  selectNextSuggestion: () => (dispatch: Dispatch, getState: GetState) => {
    const {suggestions, suggestionsSelection} = getState();
    const newSelection = Math.max(0, Math.min(suggestions.length - 1, suggestionsSelection + 1));
    dispatch(set.suggestionsSelection(newSelection));
  }
});

function topReadings(readings: JTDictReadingInfo[]) {
  return readings.slice(0, 3).map(info => info.meaning).join(', ');
}

export function topMeanings(info: JTDictReadingInfo) {
  return info.meaning.slice(0, 3).join(', ');
}
