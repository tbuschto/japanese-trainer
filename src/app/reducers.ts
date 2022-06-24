import {Reducer} from '@reduxjs/toolkit';
import {RouterState} from 'connected-react-router';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {ActionType, SyncAction} from './Action';
import {AppState, defaults} from './AppState';

export function createReducer(router: Reducer<RouterState<unknown>>) {
  const rootReducer = (state: AppState | undefined, action: SyncAction): AppState => {
    const oldState = state || defaults;
    const newState = {...oldState};
    newState.router = router(oldState.router, action);
    let changed = newState.router !== oldState.router;
    if (action.type === ActionType.SetProperty) {
      const {property, value} = action.payload;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newState[property] as any) = value;
      changed = changed || (newState[property] !== oldState[property]);
    }
    return changed ? newState : oldState;
  };
  return persistReducer({key: 'root', blacklist: ['router'], storage}, rootReducer);
}
