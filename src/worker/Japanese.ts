import * as p from 'process/browser';

global.process = p;
console.warn(process);
import {expose} from 'comlink';
import * as kuromoji from 'kuromoji';

const tokenizer: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> = new Promise(
  (resolve, reject) =>
    kuromoji.builder({
      dicPath: 'resources/dict/kuromoji'
    }).build((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
);

const japanese = {

  async test(text: string) {
    return (await tokenizer).tokenize(text);
  }

};

expose(japanese);

export type Japanese = typeof japanese;
