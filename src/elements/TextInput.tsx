import {InputHTMLAttributes} from 'react';
import {focusable} from './focusable';

type TextInputAttributes = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = (attr: TextInputAttributes) => (
  <input {...focusable(attr)} type='text' spellCheck={false}/>
);

