import {cancelEdit, saveEdit} from './actions';
import {handleInputReading, handleInputTranslation, handleInputJapanese} from './eventHandler';
import {Action} from '../../elements/Action';
import {Label} from '../../elements/Label';
import {TextInput} from '../../elements/TextInput';
import {$, _} from '../../app/hooks';
import {select, selectCardHasChanged, selectCardIsNew, selectEditCardIsValid, selectCurrentLesson, selectEditCardIsEmpty} from '../../app/selectors';
import {CLASS_DICTIONARY, CLASS_EDIT_CARD, CLASS_FORM} from '../../app/cssClassNames';
import {HTMLId} from '../../app/AppState';

export const EditCard = () => {
  const dispatch = _();
  const lesson = $(selectCurrentLesson)!;
  const card = $(select.currentQuizCard);
  const edit日本語 = $(select.editJapanese)!;
  const editReading = $(select.editReading)!;
  const editTranslation = $(select.editTranslation)!;
  return (
    <div className={CLASS_EDIT_CARD}>
      <h1>
        Lesson {lesson.name} / Card {card}
      </h1>
      <div className={CLASS_FORM}>
        <Label>Japanese:</Label>
        <TextInput autoFocus
            id={HTMLId.EditJapanese}
            value={edit日本語}
            onChange={handleInputJapanese(dispatch)}/>
        <Label>Reading:</Label>
        <TextInput
            id={HTMLId.EditReading}
            value={editReading}
            onChange={handleInputReading(dispatch)}/>
        <Label>Translation:</Label>
        <TextInput
            id={HTMLId.EditTranslation}
            value={editTranslation}
            onChange={handleInputTranslation(dispatch)}/>
        <EditControls/>
      </div>
      <div className={CLASS_DICTIONARY}>
        <Label>Dictionary:</Label>
        <ul><li>Items</li></ul>
      </div>
    </div>
  );
};

export const EditControls = () => $(selectCardIsNew)
  ? <NewCardEditControls/>
  : <ExistingCardEditControls/>;

export const NewCardEditControls = () => {
  const cardIsValid = $(selectEditCardIsValid);
  const cancelLabel = $(selectEditCardIsEmpty) ? 'Done' : 'Cancel';
  return (
    <div>
      <Action id='saveCardEdit' action={saveEdit} enabled={cardIsValid}>Next</Action>
      <Action id='cancelCardEdit' action={cancelEdit}>{cancelLabel}</Action>
    </div>
  );
};

export const ExistingCardEditControls = () => {
  const allowSave = $(selectEditCardIsValid) && $(selectCardHasChanged);
  return (
    <div>
      <Action id='saveCardEdit' action={saveEdit} enabled={allowSave}>Save</Action>
      <Action id='cancelCardEdit' action={cancelEdit}>Cancel</Action>
    </div>
  );
};
