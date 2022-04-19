import {JapaneseTrainer} from 'core';
import {Subscription} from 'rxjs';
import {clear, writeln} from 'nodeapp';
import {readkey} from 'nodeapp/terminal';

type Option = [string, () => void];

export abstract class TextScreen {

  constructor(protected app: JapaneseTrainer) {
    clear();
    this.print().catch(ex => console.error(ex));
  }

  protected abstract name(): string;

  protected abstract print(): Promise<void>;

  protected async choice(options: Option[]): Promise<void> {
    writeln(this.name());
    options.forEach(([name, _cb], i) => {
      writeln((i + 1) + ') ' + name);
    });
    let key = '0';
    while (key = await readkey()) {
      const result = parseInt(key);
      if (!isNaN(result) && result > 0 && result <= options.length) {
        options[result - 1][1]();
        break;
      }
    }
  }

  protected subscriptions: Subscription[] = [];

  dispose() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
