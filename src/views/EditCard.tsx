import {Action} from './Action';
import {Label} from './styles';
import {TextInput} from './TextInput';
import {$, _} from '../app/hooks';
import {select, selectCardHasChanged, selectCardIsNew, selectEditCardIsValid, selectCurrentLesson, selectEditCardIsEmpty} from '../app/selectors';
import {cancelEdit, saveEdit} from '../app/actions';
import {handleInputReading, handleInputTranslation, handleInput日本語 as handleInputJapanese} from '../app/InputHandler';

export const EditCard = () => {
  const dispatch = _();
  const lesson = $(selectCurrentLesson)!;
  const card = $(select.currentQuizCard);
  const edit日本語 = $(select.editJapanese)!;
  const editReading = $(select.editReading)!;
  const editTranslation = $(select.editTranslation)!;
  return (
    <div className='editCard'>
      <h1>
        Lesson {lesson.name} / Card {card}
      </h1>
      <div className='form'>
        <Label>Japanese:</Label>
        <TextInput autoFocus
            id='editJapanese'
            value={edit日本語}
            onChange={handleInputJapanese(dispatch)}/>
        <Label>Reading:</Label>
        <TextInput
            id='editReading'
            value={editReading}
            onChange={handleInputReading(dispatch)}/>
        <Label>Translation:</Label>
        <TextInput
            id='editTranslation'
            value={editTranslation}
            onChange={handleInputTranslation(dispatch)}/>
        <EditControls/>
      </div>
      <div className='dictionary'>
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
