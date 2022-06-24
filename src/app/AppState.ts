/* eslint-disable @typescript-eslint/no-explicit-any */
import {RouterState} from 'connected-react-router';

export interface AppState {
  router: RouterState<unknown>;
  screen: RootPath;
  lessons: Lessons;
  currentLesson: LessonId | null;
  currentQuestion: number;
  kanjiMode: WordElementMode;
  meaningMode: WordElementMode;
  readingMode: WordElementMode;
  quiz: Quiz | null;
  hint: string;
  editingTarget: EditingTarget;
  inputLessonName: string;
  edit日本語: string;
  editReading: string;
  editTranslation: string;
  quiz日本語: string;
  quizReading: string;
  quizTranslation: string;
  suggestions: JTDictReadingRef[];
}

export enum RootPath {
  Home = '/',
  Settings = '/settings',
  Edit = '/edit',
  Rename = '/rename',
  Quiz = '/quiz',
  Lookup = '/lookup',
  Lessons = '/lessons'
}

export enum WordElementMode {
  Show = 'SHOW',
  Ask = 'ASK',
  Hide = 'HIDE'
}

export const defaults: Readonly<AppState> = Object.freeze({
  router: null as any,
  screen: RootPath.Home,
  lessons: {},
  currentLesson: null,
  currentQuestion: 0,
  kanjiMode: WordElementMode.Show,
  meaningMode: WordElementMode.Show,
  readingMode: WordElementMode.Show,
  quiz: null,
  hint: '',
  editingTarget: 0,
  inputLessonName: 'none',
  edit日本語: '',
  editReading: '',
  editTranslation: '',
  quiz日本語: '',
  quizReading: '',
  quizTranslation: '',
  suggestions: []
});

export const properties = Object.freeze(Object.keys(defaults)) as Readonly<Array<keyof AppState>>;

export type Properties = {[T in keyof AppState]: T };

export const Property: Readonly<Properties> = (() => {
  const result: Partial<Properties> = {};
  properties.forEach(key => result[key] = key as any);
  return result as Properties;
})();

export type JTDictSeq = string;

export type JTDict = {
  [seq: JTDictSeq]: JTDictEntry
};

export type JTDictEntry = {
  [reading: string]: JTDictReadingInfo
};

export type JTDictReadingRef = {id: JTDictSeq, reading: string};

export type JTDictReadingInfo = {
  kanji?: string,
  meaning: string[],
  meta?: string[]
};

export type Phrase = {phrase: string, translation: string};
export type LessonId = string;
export type Kanji = string;
export type Reading = string;
export type Meaning = Readonly<string[]>;
export type Lessons = {[id: string]: Lesson};
export type Quiz = {correct: boolean[]};
export type EditingTarget = number | 'name' | 'none';

export interface Lesson {
  name: string;
  questions: Array<JTDictReadingRef | Phrase>;
}
