/* eslint-disable @typescript-eslint/no-explicit-any */
import {RouterState} from 'connected-react-router';
import _ from 'underscore';

export interface AppState {
  router: RouterState<unknown>;
  screen: RootPath;
  lessons: Lessons;
  cards: Cards;
  currentLesson: LessonId | null;
  currentQuizCard: number;
  kanjiMode: WordElementMode;
  meaningMode: WordElementMode;
  readingMode: WordElementMode;
  quiz: Quiz | null;
  hint: string;
  focus: HTMLId | '';
  editingTarget: EditingTarget;
  inputLessonName: string;
  editJapanese: string;
  editReading: string;
  editTranslation: string;
  quizJapanese: string;
  quizReading: string;
  quizTranslation: string;
  suggestions: Candidate[];
  suggestionsSelection: number;
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

export enum HTMLId {
  EditJapanese = 'editJapanese',
  EditReading = 'editReading',
  EditTranslation = 'editTranslation',
  SaveCardEdit = 'saveCardEdit',
  CancelCardEdit = 'CancelCardEdit'
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
  cards: {},
  currentLesson: null,
  currentQuizCard: 0,
  kanjiMode: WordElementMode.Show,
  meaningMode: WordElementMode.Show,
  readingMode: WordElementMode.Show,
  quiz: null,
  hint: '',
  focus: '',
  editingTarget: 0,
  inputLessonName: 'none',
  editJapanese: '',
  editReading: '',
  editTranslation: '',
  quizJapanese: '',
  quizReading: '',
  quizTranslation: '',
  suggestions: [],
  suggestionsSelection: -1
});

export type Properties = Readonly<keyof AppState>;
export const properties = Object.freeze(Object.keys(defaults)) as Readonly<Properties[]>;
export type PropertiesDict = {[T in Properties]: T };

export const Property: Readonly<PropertiesDict>
  = Object.freeze(_(defaults).mapObject(key => key as any));

export type JTDictSeq = string;

export type JTDict = {
  [seq: JTDictSeq]: JTDictEntry
};

export type JTDictEntry = {
  [reading: string]: JTDictReadingInfo
};

export type JTDictReadingRef = {id: JTDictSeq, reading: string};

export type JTDictReadingInfo = {
  reading: string,
  kanji?: string[],
  meaning: string[],
  meta?: string[],
  weight?: number
};

export type Candidate = {
  japanese: string,
  reading?: string,
  meaning: string[]
};

export type Card = Candidate & {
  id: string
};

export type LessonId = string;
export type CardId = string;
export type Kanji = string;
export type Reading = string;
export type Meaning = Readonly<string[]>;
export type Lessons = {[id: string]: Lesson};
export type Cards = {[id: string]: Card};
export type Quiz = {correct: boolean[]};
export type EditingTarget = number | 'name' | 'none';

export interface Lesson {
  name: string;
  cards: CardId[];
}
