import {Screen, JapaneseTrainer} from 'core';
import {HomeScreen} from './HomeScreen';
import {EditScreen} from './EditScreen';
import {TextScreen} from './TextScreen';
import {QuizScreen} from './QuizScreen';
import {LookupScreen} from './LookupScreen';
import {SettingsScreen} from './SettingsScreen';
import {LessonsScreen} from './LessonsScreen';

export class ScreenManger {

  private currentScreen: TextScreen;

  constructor(private app: JapaneseTrainer) {
    app.keyChange('screen').subscribe(({screen}) => {
      this.currentScreen?.dispose();
      this.currentScreen = this.getScreen(screen);
    });
  }

  private getScreen(screen: Screen): TextScreen {
    switch (screen) {
      case Screen.Home:
        return new HomeScreen(this.app);
      case Screen.Edit:
        return new EditScreen(this.app);
      case Screen.Quiz:
        return new QuizScreen(this.app);
      case Screen.Lookup:
        return new LookupScreen(this.app);
      case Screen.Settings:
        return new SettingsScreen(this.app);
      case Screen.Lessons:
        return new LessonsScreen(this.app);
      default:
        throw new Error(`Screen ${screen} not implemented`);
    }
  }

}
