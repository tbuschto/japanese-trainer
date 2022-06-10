import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Dispatch} from 'redux';
import {Action} from './actions';
import {AppState} from './types';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<Dispatch<Action>>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
