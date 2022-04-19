import {readFileSync} from 'fs';
import {JapaneseTrainer, JTDict} from 'core';
import {clear, writeln} from './terminal';
import {ScreenManger} from './screens/ScreenManager';

export * from './terminal';

(function main() {
  clear();
  writeln('Japanese Trainer 0.1\n');
  writeln('Loading dictionary...');
  const dict: JTDict = JSON.parse(readFileSync('./resources/dict.json', {encoding: 'utf-8'}));
  const app = new JapaneseTrainer(dict);
  new ScreenManger(app);
}());
