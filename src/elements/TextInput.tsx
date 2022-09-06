import {InputHTMLAttributes} from 'react';
import {focusable} from './focusable';
import {Label} from './Label';
import {ValidationMessage} from './ValidationMessage';
import {select} from '../app/selectors';
import {$} from '../app/hooks';

type TextInputAttributes = InputHTMLAttributes<HTMLInputElement>;
type LabeledTextInputAttributes = InputHTMLAttributes<HTMLInputElement> & {
  label: string,
  error: string
};

export const LabeledTextInput = (
  {label, error, ...attr}: LabeledTextInputAttributes
) => {
  const focusId = $(select.focus);
  const validationError = focusId === attr.id ? '' : error;
  return (
    <>
      <span>
        <Label>{label}</Label>
        <ValidationMessage>{validationError}</ValidationMessage>
      </span>
      <TextInput {...attr}/>
    </>
  );
};

export const TextInput = (attr: TextInputAttributes) => (
  <input {...focusable(attr)} type='text' spellCheck={false}/>
);
