import {expose} from 'comlink';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// const tokenizer: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> = new Promise(
//   (resolve, reject) =>
//     kuromoji.builder({
//       dicPath: '/dict/kuromoji/'
//     }).build((err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     })
// );

const kuroshiro = new Kuroshiro();

const ready = new Promise((resolve, reject) => {
  try {
    kuroshiro.init(
      new KuromojiAnalyzer({dictPath: '/dict/kuromoji/'})
    ).then(resolve, reject);
  } catch (ex) {
    reject(ex);
  }
});

// kuromoji.builder({
//   dicPath: '/dict/kuromoji/'
// }).build((err, result) => {
//   if (err) {
//     reject(err);
//   } else {
//     resolve(result);
//   }
// })
// );

const japanese = {

  async toHiragana(text: string) {
    await ready;
    return kuroshiro.convert(text, {to: 'hiragana', mode: 'spaced'});
  }

};

expose(japanese);

export type Japanese = typeof japanese;
