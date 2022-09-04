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
