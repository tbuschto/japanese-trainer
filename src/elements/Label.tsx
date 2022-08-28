import {ReactNode} from 'react';
import {CLASS_LABEL} from '../app/cssClassNames';

export const Label = (props: {children: ReactNode}) => (
  <span className={CLASS_LABEL}>{props.children}</span>
);
