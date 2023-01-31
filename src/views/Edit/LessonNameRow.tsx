import {handleInputLessonName} from './eventHandler';
import {actions} from './editActions';
import {Action} from '../../elements/Action';
import {CLASS_DATA, CLASS_LESSON} from '../../app/cssClassNames';
import {Label} from '../../elements/Label';
import {TextInput} from '../../elements/TextInput';
import {$, useAppDispatch} from '../../app/hooks';
import {select, selectCurrentLesson} from '../../app/selectors';

export function LessonNameRow() {
  return $(select.editingTarget) === 'name'
    ? <NameEditRow/>
    : <NameViewRow/>;
}

function NameViewRow() {
  const lesson = $(selectCurrentLesson)!;
  return (
    <tr>
      <td colSpan={2} className={CLASS_DATA}>
        <LessonLabel/>
        <span className={CLASS_LESSON}>
          {lesson.name}
        </span>
      </td>
      <td>
        <Action id='editLessonName' action={actions.editName}>Edit</Action>
      </td>
      <td></td>
    </tr>
  );
}

function NameEditRow() {
  const lesson = $(selectCurrentLesson)!;
  const newName = $(select.inputLessonName)!;
  const dispatch = useAppDispatch();
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      dispatch(actions.acceptInputLessonName());
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      dispatch(actions.cancelEdit());
    }
  };
  return (
    <tr>
      <td colSpan={2} className={CLASS_DATA}>
        <LessonLabel/>
        <TextInput
          className={CLASS_LESSON}
          onChange={handleInputLessonName(dispatch)}
          onKeyDown={keyHandler}
          placeholder={lesson.name}
          value={newName}
          autoFocus/>
      </td>
      <td>
        <Action action={actions.acceptInputLessonName}>Save</Action>
      </td>
      <td>
        <Action action={actions.cancelEdit}>Cancel</Action>
      </td>
    </tr>
  );
}

const LessonLabel = () => <Label>Lesson:</Label>;
