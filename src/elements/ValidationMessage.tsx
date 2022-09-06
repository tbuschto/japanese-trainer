import {ReactNode} from 'react';
import {CLASS_INVALID} from '../app/cssClassNames';

export const ValidationMessage = (props: {children: ReactNode}) => {
  if (!props.children) {
    return (<></>);
  }
  return (<span className={CLASS_INVALID}>(Invalid: {props.children}!)</span>);
};
