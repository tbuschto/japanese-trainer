import {actions} from './editActions';
import {handleInputReading, handleInputTranslation, handleInputJapanese, handleKeyDown, handleKeyUp} from './eventHandler';
import {
  selectHasPrevCard, selectHasNextCard,
  selectJapaneseValidationError, selectReadingValidationError, selectTranslationValidationError
} from './editSelectors';
import {SuggestionItem} from './SuggestionItem';
import {EditControls} from './EditControls';
import {Action} from '../../elements/Action';
import {Label} from '../../elements/Label';
import {LabeledTextInput} from '../../elements/TextInput';
import {$, useAppDispatch} from '../../app/hooks';
import {select, selectCurrentLesson} from '../../app/selectors';
import {CLASS_DICTIONARY, CLASS_DICT_BG, CLASS_EDIT_CARD, CLASS_FORM} from '../../app/cssClassNames';
import {HTMLId} from '../../app/AppState';

export const EditCard = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={CLASS_EDIT_CARD}>
      <h1>
        <span className='lessonName'>{$(selectCurrentLesson)!.name}</span>
        <span className='sep'>|</span>
        <Action action={actions.prevCard} enabled={$(selectHasPrevCard)}>
          &#129128;
        </Action>
        <span className='cardIndex'>
          &nbsp;Card {$(select.editingTarget) as number + 1}&nbsp;
        </span>
        <Action action={actions.nextCard} enabled={$(selectHasNextCard)}>
          &#129130;
        </Action>
      </h1>
      <div className={CLASS_FORM}>
        <LabeledTextInput autoFocus
            id={HTMLId.EditJapanese}
            label='Japanese:'
            error={$(selectJapaneseValidationError)}
            value={$(select.editJapanese)!}
            onKeyDown={handleKeyDown(dispatch)}
            onKeyUp={handleKeyUp(dispatch)}
            onChange={handleInputJapanese(dispatch)}/>
        <LabeledTextInput
            id={HTMLId.EditReading}
            label='Reading:'
            error={$(selectReadingValidationError)}
            value={$(select.editReading)!}
            onFocus={() => dispatch(actions.autoFill())}
            onKeyDown={handleKeyDown(dispatch)}
            onKeyUp={handleKeyUp(dispatch)}
            onChange={handleInputReading(dispatch)}/>
        <LabeledTextInput
            id={HTMLId.EditTranslation}
            label='Translation:'
            error={$(selectTranslationValidationError)}
            value={$(select.editTranslation)!}
            onKeyDown={handleKeyDown(dispatch)}
            onKeyUp={handleKeyUp(dispatch)}
            onChange={handleInputTranslation(dispatch)}/>
        <EditControls/>
      </div>
      <div className={CLASS_DICTIONARY}>
        <Label>Dictionary:</Label>
        <div className={CLASS_DICT_BG}>
          <ul>
            {$(select.suggestions).map(
              candidate => <SuggestionItem candidate={candidate}/>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

