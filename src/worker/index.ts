import {wrap, Remote} from 'comlink';
import type {Japanese} from './Japanese';

export const japanese: Remote<Japanese> = wrap(
  new Worker(
    new URL('./Japanese.ts', import.meta.url)
  )
);
