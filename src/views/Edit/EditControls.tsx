import {actions} from './editActions';
import {
  selectCardHasChanged, selectCardIsNew, selectEditCardIsValid,
  selectEditCardIsEmpty
} from './editSelectors';
import {Action} from '../../elements/Action';
import {$} from '../../app/hooks';
import {HTMLId} from '../../app/AppState';

export const EditControls = () => $(selectCardIsNew)
  ? <NewCardEditControls/>
  : <ExistingCardEditControls/>;

const NewCardEditControls = () => {
  const cardIsValid = $(selectEditCardIsValid);
  const cancelLabel = $(selectEditCardIsEmpty) ? 'Done' : 'Cancel';
  return (
    <div>
      <Action id={HTMLId.SaveCardEdit} action={actions.saveEdit} enabled={cardIsValid}>Next</Action>
      <Action id={HTMLId.CancelCardEdit} action={actions.cancelEdit}>{cancelLabel}</Action>
    </div>
  );
};

const ExistingCardEditControls = () => {
  const cardIsValid = $(selectEditCardIsValid);
  const cardHasChanged = $(selectCardHasChanged);
  const allowSave = cardIsValid && cardHasChanged;
  return (
    <div>
      <Action id={HTMLId.SaveCardEdit} action={actions.saveEdit} enabled={allowSave}>Save</Action>
      <Action id={HTMLId.CancelCardEdit} action={actions.cancelEdit}>Cancel</Action>
    </div>
  );
};
