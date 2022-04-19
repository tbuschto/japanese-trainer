import {AppState, LessonId, Lessons, Quiz, WordElementMode} from 'core';
import {combineReducers} from 'redux';
import {Action, ActionType} from './ActionCreators';
import {JPDictId, Screen} from './types';

export class Reducer {

  readonly japaneseTrainer = combineReducers<AppState, Action>(
    {
      screen, lessons, quiz, currentLesson, currentQuestion,
      kanjiMode: kanji, meaningMode: meaning, readingMode: reading
    }
  );

}

function screen(state: Screen = Screen.Home, action: Action): Screen {
  if (action.type === ActionType.SetScreen) {
    return action.payload;
  }
  return state;
}

function currentLesson(state: LessonId = '', action: Action): LessonId | null {
  if (action.type === ActionType.SetLesson) {
    return action.payload;
  }
  return state;
}

function currentQuestion(state: JPDictId | undefined, action: Action): JPDictId | null {
  if (action.type === ActionType.SetLesson) {
    return action.payload || null;
  }
  return state || null;
}

function lessons(state: Lessons | undefined): Lessons {
  return state || {};
}

function quiz(state: Quiz | undefined): Quiz | null {
  return state || null;
}

function kanji(state: WordElementMode | undefined): WordElementMode {
  return state || WordElementMode.Hide;
}

function reading(state: WordElementMode | undefined): WordElementMode {
  return state || WordElementMode.Ask;
}

function meaning(state: WordElementMode | undefined): WordElementMode {
  return state || WordElementMode.Show;
}
