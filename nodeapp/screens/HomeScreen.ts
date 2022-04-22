import {strikethrough} from 'chalk';
import {AppState, Screen} from 'core';
import {TextScreen} from './TextScreen';

export class HomeScreen extends TextScreen {

  protected name(): string {
    return 'Main Menu';
  }

  protected message({lessons, currentLesson}: AppState): string | null {
    if (!currentLesson) {
      return 'No lesson selected';
    }
    return lessons[currentLesson].name;
  }

  protected async print(state: AppState): Promise<void> {
    await this.choice([
      [
        this.labelStarQuiz(state),
        () => this.app.setScreen(Screen.Quiz)
      ],
      [
        'Select Lesson',
        () => this.app.setScreen(Screen.Lessons)
      ],
      [
        this.labelEditLesson(state),
        () => this.app.setScreen(Screen.Edit)
      ],
      [
        'Settings',
        () => this.app.setScreen(Screen.Settings)
      ],
      [
        'Exit',
        () => process.exit()
      ]
    ]);
  }

  private labelStarQuiz({currentLesson}: AppState): string {
    const label = 'Start Quiz';
    return currentLesson ? strikethrough(label) : label;
  }

  private labelEditLesson({currentLesson}: AppState): string {
    const label = 'Edit Lesson';
    return currentLesson ? strikethrough(label) : label;
  }

}
