import {ActionType, CThunk, SetPropertyAction} from './Action';
import {AppState, Lesson} from './AppState';
import {selectCurrentLesson} from './selectors';

export const setLessonProperty: CThunk<Partial<Lesson>> = payload =>
  (dispatch, getState) => {
    const {currentLesson: currentLesson, lessons} = getState();
    const oldLesson = selectCurrentLesson(getState());
    if (!oldLesson) {
      throw new Error('No lesson to set property');
    }
    const updatedLesson: Lesson = {...oldLesson, ...payload};
    dispatch(setProperty('lessons', {...lessons, [currentLesson || '']: updatedLesson}));
  };

export function setProperty<
  Property extends keyof AppState,
  Value extends AppState[Property] = AppState[Property]
>(property: Property, value: Value): SetPropertyAction {
  return action(ActionType.SetProperty, {property, value});
}

function action<T extends ActionType, U>(type: T, payload: U): {type: T, payload: U} {
  return {type, payload};
}
