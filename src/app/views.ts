import {AppState} from './types';

export function lesson({currentLesson, lessons}: AppState) {
  if (!currentLesson) {
    throw new Error('No lesson selected');
  }
  return lessons[currentLesson];
}
