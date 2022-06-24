import {AppState, Lesson} from './AppState';

export const selectLesson = (id: string) => ({lessons}: AppState) =>
  lessons[id];

export const selectLessons = ({lessons}: AppState) =>
  Object.keys(lessons).sort();

export const selectCurrentLesson = ({currentLesson: currentLesson, lessons}: AppState): Lesson | null => {
  if (!currentLesson) {
    return null;
  }
  return lessons[currentLesson];
};

export const selectEditingTarget = ({editingTarget}: AppState) => editingTarget;

export const selectInputLessonName = ({inputLessonName}: AppState) => inputLessonName;

export const selectEditReading = ({editReading}: AppState) => editReading;

// TODO: generate
