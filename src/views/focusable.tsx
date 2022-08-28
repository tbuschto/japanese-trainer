import {HTMLAttributes, useEffect, useRef} from 'react';
import {select} from '../app/selectors';
import {$, _} from '../app/hooks';
import {setProperty} from '../app/actions';

export function focusable<T extends HTMLAttributes<HTMLElement>>(attr: T): T {
  const dispatch = _();
  const focusId = $(select.focus);
  const focusEffect = {
    onFocus: () => {
      if (attr.id) {
        dispatch(setProperty('focus', attr.id || ''));
      }
    },
    ref: useRef<HTMLInputElement>(null),
    tabIndex: attr.tabIndex || 0
  };
  useEffect(() => {
    if (focusId === attr.id) {
      focusEffect.ref.current?.focus();
    }
  }, [focusId, attr.id]);
  return {...attr, ...focusEffect};
}
