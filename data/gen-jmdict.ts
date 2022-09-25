/* eslint-disable @typescript-eslint/naming-convention */
import {writeFileSync, readFileSync} from 'fs';
import {Parser} from 'xml2js';
import type {JTDict, JTDictEntry, JTDictReadingInfo} from '../src/app/AppState';

type JMdict = Entry[];

/**
 * Entries consist of kanji elements, reading elements,
 * general information and sense elements. Each entry must have at
 * least one reading element and one sense element. Others are optional.
 */
type Entry = Readonly<{
  /**
   * A unique numeric sequence number for each entry
   */
  ent_seq: string,
  k_ele?: Kanji | Kanji[],
  r_ele: Reading | Reading[],
  sense: Sense | Sense[]
}>;

/**
 * The kanji element, or in its absence, the reading element, is
 * the defining component of each entry.
 * The overwhelming majority of entries will have a single kanji
 * element associated with a word in Japanese. Where there are
 * multiple kanji elements within an entry, they will be orthographical
 * variants of the same word, either using variations in okurigana, or
 * alternative and equivalent kanji. Common "mis-spellings" may be
 * included, provided they are associated with appropriate information
 * fields. Synonyms are not included; they may be indicated in the
 * cross-reference field associated with the sense element.
 */
type Kanji = {
  /**
   * This element will contain a word or short phrase in Japanese
   * which is written using at least one non-kana character (usually kanji,
   * but can be other characters). The valid characters are
   * kanji, kana, related characters such as chouon and kurikaeshi, and
   * in exceptional cases, letters from other alphabets.
   */
  keb: string,
  /**
   * This is a coded information field related specifically to the
   * orthography of the keb, and will typically indicate some unusual
   * aspect, such as okurigana irregularity.
   */
  ke_inf?: string,
  /**
   * This and the equivalent re_pri field are provided to record
   * information about the relative priority of the entry,  and consist
   * of codes indicating the word appears in various references which
   * can be taken as an indication of the frequency with which the word
   * is used. This field is intended for use either by applications which
   * want to concentrate on entries of  a particular priority, or to
   * generate subset files.
   * The current values in this field are:
   * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
   * from the Mainichi Shimbun. (See the Monash ftp archive for a copy.)
   * Words in the first 12,000 in that file are marked "news1" and words
   * in the second 12,000 are marked "news2".
   * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
   * Publishing, Tokyo, 1998.  (The entries marked "ichi2" were
   * demoted from ichi1 because they were observed to have low
   * frequencies in the WWW and newspapers.)
   * - spec1 and spec2: a small number of words use this marker when they
   * are detected as being common, but are not included in other lists.
   * - gai1/2: common loanwords, based on the wordfreq file.
   * - nfxx: this is an indicator of frequency-of-use ranking in the
   * wordfreq file. "xx" is the number of the set of 500 words in which
   * the entry can be found, with "01" assigned to the first 500, "02"
   * to the second, and so on. (The entries with news1, ichi1, spec1, spec2
   * and gai1 values are marked with a "(P)" in the EDICT and EDICT2
   * files.)
   * The reason both the kanji and reading elements are tagged is because
   * on occasions a priority is only associated with a particular
   * kanji/reading pair.
   */
  ke_pri?: string
};

/**
 * The reading element typically contains the valid readings
 * of the word(s) in the kanji element using modern kanadzukai.
 * Where there are multiple reading elements, they will typically be
 * alternative readings of the kanji element. In the absence of a
 * kanji element, i.e. in the case of a word or phrase written
 * entirely in kana, these elements will define the entry.
 */
type Reading = {
  /**
   * This element content is restricted to kana and related
   * characters such as chouon and kurikaeshi. Kana usage will be
   * consistent between the keb and reb elements; e.g. if the keb
   * contains katakana, so too will the reb.
   */
  reb: string,
  /**
   * This element, which will usually have a null value, indicates
   * that the reb, while associated with the keb, cannot be regarded
   * as a true reading of the kanji. It is typically used for words
   * such as foreign place names, gairaigo which can be in kanji or
   * katakana, etc.
   */
  re_nokanji?: string,
  /**
   * This element is used to indicate when the reading only applies
   * to a subset of the keb elements in the entry. In its absence, all
   * readings apply to all kanji elements. The contents of this element
   * must exactly match those of one of the keb elements.
   */
  re_restr?: string | string[],
  /**
   * General coded information pertaining to the specific reading.
   * Typically it will be used to indicate some unusual aspect of
   * the reading.
   */
  e_inf?: string,
  re_pri?: string
};

/**
 * The sense element will record the translational equivalent
 * of the Japanese word, plus other related information. Where there
 * are several distinctly different meanings of the word, multiple
 * sense elements will be employed.
 */
type Sense = Readonly<{
  /**
   * If present, indicate that the sense is restricted
   * to the lexeme represented by the keb.
   */
  stagk?: string | string[],
  /**
   * If present, indicate that the sense is restricted
   * to the lexeme represented by the reb.
   */
  stagr?: string | string[],
  /**
   * Part-of-speech information about the entry/sense. Should use
   * appropriate entity codes. In general where there are multiple senses
   * in an entry, the part-of-speech of an earlier sense will apply to
   * later senses unless there is a new part-of-speech indicated.
   */
  pos?: string,
  /**
  * This element is used to indicate a cross-reference to another
  * entry with a similar or related meaning or sense. The content of
  * this element is typically a keb or reb element in another entry. In some
  * cases a keb will be followed by a reb and/or a sense number to provide
  * a precise target for the cross-reference. Where this happens, a JIS
  * centre-dot" (0x2126) is placed between the components of the
  * cross-reference. The target keb or reb must not contain a centre-dot.
  */
  xref?: string,
  /**
   * This element is used to indicate another entry which is an
   * antonym of the current entry/sense. The content of this element
   * must exactly match that of a keb or reb element in another entry.
   */
  ant?: string,
  /**
  * Information about the field of application of the entry/sense.
  * When absent, general application is implied. Entity coding for
  * specific fields of application.
  */
  field?: string,
  /**
   * This element is used for other relevant information about
   * the entry/sense. As with part-of-speech, information will usually
   * apply to several senses.
   */
  misc?: string,
  /**
   * The sense-information elements provided for additional
   * information to be recorded about a sense. Typical usage would
   * be to indicate such things as level of currency of a sense, the
   * regional variations, etc.
   */
  s_inf?: string,
  /**
   * This element records the information about the source
   * language(s) of a loan-word/gairaigo. If the source language is other
   * than English, the language is indicated by the xml:lang attribute.
   * The element value (if any) is the source word or phrase.
   */
  lsource?: {},
  /**
   * For words specifically associated with regional dialects in
   * Japanese, the entity code for that dialect, e.g. ksb for Kansaiben.
   */
  dial?: string,
  /**
   * Within each sense will be one or more "glosses", i.e.
   * target-language words or phrases which are equivalents to the
   * Japanese word. This element would normally be present, however it
   * may be omitted in entries which are purely for a cross-reference.
   */
  gloss: Gloss | Gloss[],
  example?: Example | Example[]
}>;

/**
 * The example elements contain a Japanese sentence using the term
 * associated with the entry, and one or more translations of that sentence.
 * Within the element, the ex_srce element will indicate the source of the
 * sentences (typically the sequence number in the Tatoeba Project), the
 * ex_text element will contain the form of the term in the Japanese
 * sentence, and the ex_sent elements contain the example sentences.
 */
type Example = {
  ex_srce: string,
  ex_text: string,
  ex_sent: string[]
};

type Gloss = string | {
  _: string,
  $: {}
};

(async function buildDictionary() {
  const parser = new Parser({
    strict: false,
    normalizeTags: true,
    explicitArray: false
  });
  console.info('Parsing XML...');
  const xml = readFileSync('./data/JMdict_e.xml', {encoding: 'utf-8'});
  const json = await parser.parseStringPromise(xml);
  const all = json.jmdict.entry as JMdict;
  const dict: JTDict = {};
  all.forEach(it => {
    dict[it.ent_seq] = JTDictEntry(it);
  });
  console.info('Writing JSON...');
  writeFileSync(
    './public/dict/JMdict/dict.json',
    JSON.stringify(dict),
    {encoding: 'utf-8'}
  );
  console.info('Done!');
}().catch(ex => console.error(ex)));

function JTDictEntry(src: Entry): JTDictEntry {
  const result: JTDictEntry = {};
  asArray(src.sense).forEach(sense => {
    const readings = getReadings(src, sense);
    if (!readings.length) {
      console.log('No reading:');
      console.log(src);
    }
    readings.forEach(reading => {
      const readingInfo: JTDictReadingInfo = result[reading] || {reading, meaning: []};
      readingInfo.meaning = readingInfo.meaning.concat(getMeanings(sense));
      if (!readingInfo.kanji) {
        readingInfo.kanji = getKanji(src, sense);
      }
      result[reading] = readingInfo;
    });
  });
  return result;
}

function getMeanings(sense: Sense): string[] {
  return asArray(sense.gloss).map(it => {
    if (it instanceof Object) {
      return it._;
    }
    return it;
  });
}

function getKanji(src: Entry, sense: Sense): string[] {
  if (sense.stagk) {
    return asArray(sense.stagk);
  }
  return asArray(src.k_ele)
    .filter(el => el?.keb)
    .map(el => el!)
    .sort((a, b) => (b.ke_pri ? 1 : 0) - (a.ke_pri ? 1 : 0))
    .map(a => a.keb);
}

function getReadings(src: Entry, sense: Sense): string[] {
  if (sense.stagr) {
    return asArray(sense.stagr);
  }
  return asArray(src.r_ele)
    .filter(it => !sense.stagk || !it.re_restr || intersects(it.re_restr, sense.stagk))
    .sort((a, b) => (b.re_pri ? 1 : 0) - (a.re_pri ? 1 : 0))
    .map(it => it.reb);
}

function intersects(a: string | string[], b: string | string[]): boolean {
  if (a === b) {
    return true;
  }
  const aArr = asArray(a);
  const bArr = asArray(b);
  return aArr.some(candidate => bArr.includes(candidate));
}

function asArray<T>(value: (T | T[])): T[] {
  if (!value) {
    return [];
  }
  if (value instanceof Array) {
    return value.concat();
  }
  return [value];
}
