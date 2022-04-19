import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class LookupScreen extends TextScreen {

  protected name(): string {
    return 'Enter Word';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['Back', () => this.app.actions.setScreen(Screen.Edit)]
    ]);
  }

}
