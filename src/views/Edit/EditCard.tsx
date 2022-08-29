import {cancelEdit, nextCard, prevCard, saveEdit} from './actions';
import {handleInputReading, handleInputTranslation, handleInputJapanese} from './eventHandler';
import {Action} from '../../elements/Action';
import {Label} from '../../elements/Label';
import {TextInput} from '../../elements/TextInput';
import {$, _} from '../../app/hooks';
import {select, selectCardHasChanged, selectCardIsNew, selectEditCardIsValid, selectCurrentLesson, selectEditCardIsEmpty, selectHasPrevCard, selectHasNextCard} from '../../app/selectors';
import {CLASS_DICTIONARY, CLASS_EDIT_CARD, CLASS_FORM} from '../../app/cssClassNames';
import {HTMLId} from '../../app/AppState';

export const EditCard = () => {
  const dispatch = _();
  return (
    <div className={CLASS_EDIT_CARD}>
      <h1>
        <span className='lessonName'>{$(selectCurrentLesson)!.name}</span>
        <span className='sep'>|</span>
        <Action action={prevCard} enabled={$(selectHasPrevCard)}>
          &#129128;
        </Action>
        <span className='cardIndex'>
          &nbsp;Card {$(select.editingTarget) as number + 1}&nbsp;
        </span>
        <Action action={nextCard} enabled={$(selectHasNextCard)}>
          &#129130;
        </Action>
      </h1>
      <div className={CLASS_FORM}>
        <Label>Japanese:</Label>
        <TextInput autoFocus
            id={HTMLId.EditJapanese}
            value={$(select.editJapanese)!}
            onChange={handleInputJapanese(dispatch)}/>
        <Label>Reading:</Label>
        <TextInput
            id={HTMLId.EditReading}
            value={$(select.editReading)!}
            onChange={handleInputReading(dispatch)}/>
        <Label>Translation:</Label>
        <TextInput
            id={HTMLId.EditTranslation}
            value={$(select.editTranslation)!}
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
