export type JTDict = {
  [seq: string]: JTDictEntry
};

export type JTDictEntry = {
  [reading: string]: JTDictReadingInfo
};

export type JTDictReadingInfo = {
  kanji?: string,
  meaning: string[],
  meta?: string[]
};

export enum Screen {
  Home = 'HOME',
  Settings = 'SETTINGS',
  Edit = 'EDIT',
  Quiz = 'QUIZ',
  Lookup = 'LOOKUP',
  Lessons = 'LESSONS'
}

export enum WordElementMode {
  Show = 'SHOW',
  Ask = 'ASK',
  Hide = 'HIDE'
}

export type LessonId = string;
export type JPDictId = string;
export type Kanji = string;
export type Reading = string;
export type Meaning = Readonly<string[]>;
export type Lessons = {[id: string]: Lesson};
export type Quiz = {[id: JPDictId]: boolean};

export interface Lesson {
  name: string;
  content: JTDictEntry[];
}

export interface AppState {
  screen: Screen;
  lessons: Lessons;
  currentLesson: LessonId | null;
  currentQuestion: JPDictId | null;
  kanjiMode: WordElementMode;
  meaningMode: WordElementMode;
  readingMode: WordElementMode;
  quiz: Quiz | null;
}
