import {FormEvent} from 'react';
import {Dispatch, Action} from './Action';
import {groupLog} from './groupLog';

export const InputHandler = (handler: (v: string) => Action) =>
  (dispatch: Dispatch) =>
    (ev: FormEvent<HTMLInputElement>) => groupLog(
      [ev.currentTarget.id, ev.currentTarget.value],
      () => dispatch(handler(ev.currentTarget.value))
    );
