import {wrap, Remote} from 'comlink';
import type {Japanese} from './Japanese';

export const worker: Remote<Japanese> = wrap(
  new Worker(
    new URL('./Japanese.ts', import.meta.url)
  )
);
