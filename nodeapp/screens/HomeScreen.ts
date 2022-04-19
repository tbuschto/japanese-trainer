import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class HomeScreen extends TextScreen {

  protected name(): string {
    return 'Main Menu';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['Start Quiz', () => this.app.actions.setScreen(Screen.Quiz)],
      ['Edit Lesson', () => this.app.actions.setScreen(Screen.Edit)],
      ['Settings', () => this.app.actions.setScreen(Screen.Settings)],
      ['Exit', () => process.exit()]
    ]);
  }

}
