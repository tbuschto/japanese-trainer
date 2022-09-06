import React, {HTMLAttributes, useEffect, useRef} from 'react';
import {select} from '../app/selectors';
import {$, _} from '../app/hooks';
import {setProperty} from '../app/actions';
import {HTMLId} from '../app/AppState';

export function focusable<T extends HTMLAttributes<HTMLElement>>(
  attr: T
): T {
  const dispatch = _();
  const focusId = $(select.focus);
  const focusEffect = {
    onFocus: (ev: React.FocusEvent<HTMLElement>) => {
      if (attr.id) {
        dispatch(setProperty('focus', attr.id as HTMLId || ''));
      }
      attr.onFocus?.call(null, ev);
    },
    ref: useRef<HTMLElement>(null),
    tabIndex: attr.tabIndex || 0
  };
  useEffect(() => {
    if (focusId === attr.id) {
      focusEffect.ref.current?.focus();
    }
  }, [focusId, attr.id]);
  return {...attr, ...focusEffect};
}
