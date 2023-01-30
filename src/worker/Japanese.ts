/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {expose} from 'comlink';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import {toHiragana} from '@koozaki/romaji-conv';
import type {JTDict, JTDictEntry, JTDictReadingInfo} from '../app/AppState';

const kuroshiro = new Kuroshiro();
const {isJapanese} = Kuroshiro.Util;

const kuroshiroIsReady = new Promise((resolve, reject) => {
  try {
    kuroshiro.init(
      new KuromojiAnalyzer({dictPath: '/dict/kuromoji/'})
    ).then(resolve, reject);
  } catch (ex) {
    reject(ex);
  }
});

type JTDictLookup = {[key: string]: JTDictReadingInfo[]};

const jtDict = {
  byId: {} as JTDict,
  all: [] as JTDictEntry[],
  byJapanese: {} as JTDictLookup,
  japaneseKeys: [] as string[],
  byReading: {} as JTDictLookup,
  readingKeys: [] as string[],
  byTranslation: {} as JTDictLookup
};

const jtDictReady = (async () => {
  console.info('Start loading jtDict');
  const startup = Date.now();
  const response = await fetch('/dict/JMdict/dict.json');
  jtDict.byId = await response.json();
  const parsed = Date.now();
  console.info(`jtDict loaded in ${parsed - startup} ms`);
  jtDict.all = Object.keys(jtDict.byId).map(id => jtDict.byId[id]);
  jtDict.all.forEach(entry => {
    for (const reading in entry) {
      const readingInfo = entry[reading];
      const allKanji = readingInfo.kanji || [];
      addUnique(jtDict.byReading, reading, readingInfo);
      for (let i = 0; i < allKanji.length; i++) {
        jtDict.japaneseKeys.push(allKanji[i]);
        addUnique(jtDict.byJapanese, allKanji[i], readingInfo);
      }
    }
  });
  jtDict.readingKeys = Object.keys(jtDict.byReading);
  console.info(`jtDict parsed in ${Date.now() - parsed} ms`);
})();

const japanese = {

  async toHiragana(textWithKanji: string) {
    if (!textWithKanji) {
      return '';
    }
    await kuroshiroIsReady;
    return kuroshiro.convert(textWithKanji, {to: 'hiragana', mode: 'spaced'});
  },

  async findByKanji(text: string) {
    if (!text) {
      return [];
    }
    await jtDictReady;
    return jtDict.byJapanese[text] || [];
  },

  async startsWithKanji(partial: string): Promise<JTDictReadingInfo[]> {
    if (!partial) {
      return [];
    }
    await jtDictReady;
    return jtDict.japaneseKeys
      .filter(key => key.startsWith(partial))
      .slice(0, 100)
      .flatMap(key => jtDict.byJapanese[key])
      .filter(unique)
      .map(info => ({...info, weight: kanjiWeight(info, partial)}))
      .sort((a, b) => b.weight - a.weight);
  },

  async findByReading(text: string) {
    if (!text) {
      return [];
    }
    await jtDictReady;
    return jtDict.byReading[asJapanese(text)] || [];
  },

  async startsWithReading(partial: string): Promise<JTDictReadingInfo[]> {
    if (!partial) {
      return [];
    }
    await jtDictReady;
    const needle = asJapanese(partial);
    const results = jtDict.readingKeys.filter(key => key.startsWith(needle));
    const variants = [] as string[];
    soundAlikes(needle).forEach(variant => {
      variants.push(variant);
      results.push(...jtDict.readingKeys.filter(key => key.startsWith(variant)));
    });
    chouon(needle).forEach(variant => {
      variants.push(variant);
      results.push(...jtDict.readingKeys.filter(key => key.startsWith(variant)));
    });
    sokuon(needle).forEach(variant => {
      variants.push(variant);
      results.push(...jtDict.readingKeys.filter(key => key.startsWith(variant)));
    });
    return results
      .slice(0, 100)
      .flatMap(reading => jtDict.byReading[reading])
      .map(info => ({...info, weight: readingWeight(info, needle, variants)}))
      .sort((a, b) => b.weight - a.weight);
  }

};

expose(japanese);

export type Japanese = typeof japanese;

function asJapanese(str: string): string {
  const trimmed = str.trim();
  if (!trimmed || trimmed.split('').every(isJapanese)) {
    return str;
  }
  return toHiragana(trimmed).split('').filter(isJapanese).join('');
}

function addUnique(target: JTDictLookup, reading: string, info: JTDictReadingInfo) {
  target[reading] = target[reading] || [];
  if (!target[reading].includes(info)) {
    target[reading].push(info);
  }
}

function unique(value: unknown, index: number, self: unknown[]): boolean {
  return self.indexOf(value) === index;
}

function readingWeight(info: JTDictReadingInfo, partial: string, variants: string[]): number {
  if (info.reading === partial) {
    return 10000;
  }
  if (variants.some(variant => variant === info.reading)) {
    return 1000;
  }
  return (100 - info.reading.length);
}

function kanjiWeight(info: JTDictReadingInfo, partial: string): number {
  if (info.kanji?.at(0) === partial) {
    return 1000;
  }
  if (info.kanji?.some(kanji => kanji === partial)) {
    return 100;
  }
  return (info.kanji || [])
    .filter(str => str.startsWith(partial))
    .map(str => 100 - str.length)
    .reduce((prev, current) => Math.max(prev, current), 0);
}

const ALIKE = Object.freeze({
  ま: ['な'],
  あ: ['は', 'わ'],
  い: ['いえ'],
  お: ['を'],
  え: ['へ'],
  ち: ['じ'],
  は: ['わ', 'あ'],
  せ: ['ぜ']
}) as Record<string, string[]>;

function soundAlikes(str: string): string[] {
  return makeVariants(str, ({current}) => ALIKE[current] || []);
}

const VOWELS = Object.freeze({
  あ: 'かさたなはまらがざだばぱやゃわ'.split(''),
  い: 'きしちにひみりぎじぢびぴ'.split(''),
  う: 'くすつぬふむるぐずづぶぷゆゅ'.split(''),
  え: 'けせてねへめれげぜでべぺ'.split(''),
  お: 'こそとのほもろごぞどぼぽよょを'.split('')
}) as Record<string, string[]>;

function chouon(str: string): string[] {
  return makeVariants(str, ({current, next, previous}) => {
    if (VOWELS[current] && (next !== current) && (previous !== current)) {
      return current === 'お' ? [current + 'う'] : [current + current];
    }
    return [];
  });
}

function sokuon(str: string): string[] {
  return makeVariants(str, ({current, previous}) => {
    if (!previous || previous === 'っ') {
      return [];
    }
    for (const vowel in VOWELS) {
      const index = VOWELS[vowel].indexOf(current);
      if (index === -1) {
        continue;
      } else if (index < 3 || index === 11) { // K, S, T or P
        return ['っ' + current];
      } else if (index === 3) { // N
        return ['ん' + current];
      }
    }
    return [];
  });
}

type Trio = {current: string, previous: string, next: string};

function makeVariants(str: string, cb: (trio: Trio) => string[]) {
  const results: string[] = [];
  str.split('').forEach((value, i, arr) => {
    const trio: Trio = {current: value, previous: arr[i - 1] || '', next: arr[i + 1] || ''};
    cb(trio).forEach(insert =>
      results.push(str.slice(0, i) + insert + str.slice(i + 1))
    );
  });
  return results;
}
