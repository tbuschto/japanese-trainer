import {ThunkAction} from 'redux-thunk';
import {Action, ActionType} from './actions';
import {AppState, Lesson} from './types';

type Thunk = ThunkAction<void, AppState, void, Action>;

export const createNewLesson: Thunk = (dispatch, getState) => {
  const state = getState();
  const lastId = Object.keys(state.lessons)
    .map(id => parseInt(id, 10))
    .reduce((a, b) => Math.max(a, b));
  const id = (lastId + 1).toString();
  const lesson: Lesson = {
    name: 'Lesson ' + id,
    content: []
  };
  dispatch({type: ActionType.SetLessons, payLoad: {[id]: lesson, ...state.lessons}});
};
