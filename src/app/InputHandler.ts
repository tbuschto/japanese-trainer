import {FormEvent} from 'react';
import {Dispatch, Action} from './Action';

export const InputHandler = (handler: (v: string) => Action) =>
  (dispatch: Dispatch) =>
    (ev: FormEvent<HTMLInputElement>) =>
      dispatch(handler(ev.currentTarget.value));

