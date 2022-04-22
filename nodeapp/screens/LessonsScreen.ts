import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class LessonsScreen extends TextScreen {

  protected name(): string {
    return 'Lessons';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['New', () => this.app.createNewLesson()],
      ['Back', () => this.app.setScreen(Screen.Edit)]
    ]);
  }

}
