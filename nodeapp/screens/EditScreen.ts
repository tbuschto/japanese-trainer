import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class EditScreen extends TextScreen {

  protected name(): string {
    return 'Lesson';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['Add Word', () => this.app.setScreen(Screen.Lookup)],
      ['Remove Word', () => this.app.setScreen(Screen.Lookup)],
      ['Back', () => this.app.setScreen(Screen.Home)]
    ]);
  }

}
