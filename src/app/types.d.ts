/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-default-export */
declare module 'process/browser'

// https://github.com/supasate/connected-react-router/issues/570
declare module 'connected-react-router' {

  interface ConnectedRouterProps {
    children?: JSX.Element;
  }

}

declare module 'kuromoji/src/Tokenizer' {

  import * as kuromoji from 'kuromoji';

  class Tokenizer<T> implements kuromoji.Tokenizer<T> {

    constructor(dict: unknown);

  }

  export = Tokenizer;

}

declare module 'kuromoji/src/loader/DictionaryLoader' {

  export type LoaderCallback = (err: string?, buffer: Uint8Array?) => void;

  abstract class DictionaryLoader {

    constructor(dicPath: string);

    abstract loadArrayBuffer(file: string, callback: LoaderCallback);

    load(callback: (err: string, dic: unknown) => void);

  }

  export = DictionaryLoader;

}

declare module 'kuroshiro-analyzer-kuromoji' {
  export default class KuromojiAnalyzer {

    constructor({dictPath: string});

  }
}

declare module 'kuroshiro' {

  interface Options {
    to?: 'hiragana' | 'katakana' | 'romaji';
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    romajiSystem?: 'nippon' | 'passport' | 'hepburn';
    delimiter_start?: string;
    delimiter_end?: string;
  }

  interface Util {
    isHiragana(str: string): boolean;
    isKatakana(str: string): boolean;
    isKana(str: string): boolean;
    isKanji(str: string): boolean;
    isJapanese(str: string): boolean;
    hasHiragana(str: string): boolean;
    hasKatakana(str: string): boolean;
    hasKana(str: string): boolean;
    hasKanji(str: string): boolean;
    hasJapanese(str: string): boolean;
    kanaToHiragna(str: string): string;
    kanaToKatakana(str: string): string;
    kanaToRomaji(str: string): string;
  }

  export default class Kuroshiro {

    static Util: Util;

    async init(analyzer: unknown): Promise<void>;

    convert(str: string, options?: Options): string;

  }

}
