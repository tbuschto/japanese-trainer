import {AppState, JapaneseTrainer} from 'core';
import {Subscription} from 'rxjs';
import {clear, writeln} from 'nodeapp';
import {readkey} from 'nodeapp/terminal';

type Option = [string, () => void];

export abstract class TextScreen {

  constructor(protected app: JapaneseTrainer) {
    this.subscriptions.push(this.app.state.subscribe(state => {
      clear();
      const name = this.name();
      const message = this.message(state);
      const heading = name + ' | ' + message;
      writeln(heading);
      const separator = heading.replace(/./g, '=');
      writeln(separator);
      this.print(state).catch(ex => console.error(ex));
    }));
  }

  protected abstract name(): string;
  protected subscriptions: Subscription[] = [];

  protected message(_state: AppState): string | null {
    return null;
  }

  protected abstract print(appState: AppState): Promise<void>;

  protected async choice(options: Option[]): Promise<void> {
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

  dispose() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
