import {RouterState} from 'connected-react-router';

export type JTDictSeq = string;

export type JTDict = {
  [seq: JTDictSeq]: JTDictEntry
};

export type JTDictEntry = {
  [reading: string]: JTDictReadingInfo
};

export type JTDictReadingInfo = {
  kanji?: string,
  meaning: string[],
  meta?: string[]
};

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

export type LessonId = string;
export type Kanji = string;
export type Reading = string;
export type Meaning = Readonly<string[]>;
export type Lessons = {[id: string]: Lesson};
export type Quiz = {correct: boolean[]};

export interface Lesson {
  name: string;
  questions: Array<{id: JTDictSeq, reading: string} | {phrase: string, translation: string}>;
}

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
}
