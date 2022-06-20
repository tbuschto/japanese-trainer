import {useState, FormEvent} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Dispatch} from './Action';
import {AppState} from './AppState';

export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export type State<T> = {get: () => T, set(value: any): void};
export const useInput = (init: string): State<string> => {
  const [value, setValue] = useState(init);
  return {
    get: () => value,
    set: (ev: FormEvent<HTMLInputElement>) => setValue(ev.currentTarget.value)
  };
};
