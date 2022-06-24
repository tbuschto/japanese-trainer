import {CallHistoryMethodAction} from 'connected-react-router';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppState} from './AppState';

export enum ActionType {
  SetProperty = 'SET_PROPERTY'
}

export type SetPropertyAction<Property extends keyof AppState = keyof AppState, Value = AppState[Property]> = {
  type: ActionType.SetProperty, payload: {property: Property, value: Value}
};

export type SyncAction = CallHistoryMethodAction | SetPropertyAction;

export type AsyncAction<R = Promise<void> | void> = ThunkAction<
  R, AppState, void, SyncAction
>;

export type Dispatch = ThunkDispatch<AppState, void, SyncAction>;
export type CThunk<T = void> = (arg: T) => ThunkAction<void, AppState, void, SyncAction>;
export type CAction<T> = (payload: T) => SyncAction;

export type Action = SyncAction | AsyncAction;
