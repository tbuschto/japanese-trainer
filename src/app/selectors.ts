import {AppState, EditingTarget, Lesson} from './AppState';

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

export function selectEditingTarget({editingTarget}: AppState): EditingTarget {
  return editingTarget;
}

export function selectEditingValue({editingValue}: AppState): string {
  return editingValue;
}
