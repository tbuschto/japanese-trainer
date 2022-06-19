import {ReactNode} from 'react';

export const LABEL = 'label';
export const LESSON = 'lesson';

export const Label = (props: {children: ReactNode}) => (
  <span className={LABEL}>{props.children}</span>
);
