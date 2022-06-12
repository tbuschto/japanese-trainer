import {AppState, Lesson} from './types';

export function selectLessons({currentLesson, lessons}: AppState): Lesson | null {
  if (!currentLesson) {
    return null;
  }
  return lessons[currentLesson];
}

export function selectLesson({currentLesson, lessons}: AppState): Lesson | null {
  if (!currentLesson) {
    return null;
  }
  return lessons[currentLesson];
}
