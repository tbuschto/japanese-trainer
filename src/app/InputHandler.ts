import {FormEvent} from 'react';
import {Dispatch, Action} from './Action';
import {setProperty} from './actions';

export const InputHandler = (handler: (v: string) => Action) =>
  (dispatch: Dispatch) =>
    (ev: FormEvent<HTMLInputElement>) =>
      dispatch(handler(ev.currentTarget.value));

export const handleInput日本語 = InputHandler(value => setProperty('editJapanese', value));
export const handleInputReading = InputHandler(value => setProperty('editReading', value));
export const handleInputTranslation = InputHandler(value => setProperty('editTranslation', value));
export const handleInputLessonName = InputHandler(value => setProperty('inputLessonName', value));
