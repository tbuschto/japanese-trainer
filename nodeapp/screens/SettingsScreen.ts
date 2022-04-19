import {Screen} from 'core';
import {TextScreen} from './TextScreen';

export class SettingsScreen extends TextScreen {

  protected name(): string {
    return 'Settings';
  }

  protected async print(): Promise<void> {
    await this.choice([
      ['Back', () => this.app.actions.setScreen(Screen.Home)]
    ]);
  }

}
