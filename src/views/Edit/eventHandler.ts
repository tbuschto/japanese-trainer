import {KeyboardEventHandler} from 'react';
import {actions} from './editActions';
import {Dispatch, setProperty} from '../../app/Action';
import {InputHandler} from '../../app/InputHandler';

export const handleInputJapanese = InputHandler(value => async (dispatch) => {
  dispatch(setProperty('editJapanese', value));
  await dispatch(actions.updateSuggestions());
});
export const handleInputReading = InputHandler(value => setProperty('editReading', value));
export const handleInputTranslation = InputHandler(value => setProperty('editTranslation', value));
export const handleInputLessonName = InputHandler(value => setProperty('inputLessonName', value));

export const handleKeyDown: (dispatch: Dispatch) => KeyboardEventHandler = dispatch => ev => {
  switch(ev.key) {
    case 'ArrowDown':
      dispatch(actions.selectNextSuggestion());
      ev.preventDefault();
      break;
    case 'ArrowUp':
      dispatch(actions.selectPreviousSuggestion());
      ev.preventDefault();
      break;
    case 'Enter':
      console.info('select');
      ev.preventDefault();
      break;
    default: break;
  }
};
