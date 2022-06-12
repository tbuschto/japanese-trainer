import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Dispatch} from './actions';
import {AppState} from './types';

export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
