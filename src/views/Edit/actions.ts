import {CAction, CThunk} from '../../app/Action';
import {setLessonProperty, setProperty} from '../../app/actions';
import {Card, EditingTarget, HTMLId} from '../../app/AppState';
import {selectCardIsNew, selectCards, selectCurrentEditCard, selectCurrentLesson} from '../../app/selectors';

export const newCard: CThunk = () => (dispatch, getState) => {
  const cards = selectCurrentLesson(getState())!.cards!;
  dispatch(setEditingTarget(cards.length));
  dispatch(setProperty('focus', HTMLId.EditJapanese));
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

export const acceptInputLessonName: CThunk = () => (dispatch, getState) => {
  const value = getState().inputLessonName;
  if (!value) {
    return;
  }
  dispatch(setLessonProperty({name: value}));
  dispatch(setEditingTarget('none'));
};