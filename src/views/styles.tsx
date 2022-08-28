import {ReactNode} from 'react';

export const LABEL = 'label';
export const FLEX_CONTAINER = 'flexContainer';
export const LESSON = 'lesson';
export const DATA = 'data';

export const Label = (props: {children: ReactNode}) => (
  <span className={LABEL}>{props.children}</span>
);
