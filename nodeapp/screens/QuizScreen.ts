import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class QuizScreen extends TextScreen {

  protected name(): string {
    return 'Quiz';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['Back', () => this.app.setScreen(Screen.Home)]
    ]);
  }

}
