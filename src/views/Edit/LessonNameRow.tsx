import {handleInputLessonName} from './eventHandler';
import {cancelEdit, acceptInputLessonName, editName} from './actions';
import {Action} from '../../elements/Action';
import {CLASS_DATA, CLASS_LESSON} from '../../app/cssClassNames';
import {Label} from '../../elements/Label';
import {TextInput} from '../../elements/TextInput';
import {$, _} from '../../app/hooks';
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
        <Action id='editLessonName' action={editName}>Edit</Action>
      </td>
      <td></td>
    </tr>
  );
}

function NameEditRow() {
  const lesson = $(selectCurrentLesson)!;
  const newName = $(select.inputLessonName)!;
  const dispatch = _();
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      dispatch(acceptInputLessonName());
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      dispatch(cancelEdit());
    }
  };
  return (
    <tr>
      <td>
        <LessonLabel/>
      </td>
      <td className={CLASS_DATA}>
        <TextInput
          className={CLASS_LESSON}
          onChange={handleInputLessonName(dispatch)}
          onKeyDown={keyHandler}
          placeholder={lesson.name}
          value={newName}
          autoFocus/>
      </td>
      <td>
        <Action action={acceptInputLessonName}>Save</Action>
      </td>
      <td>
        <Action action={cancelEdit}>Cancel</Action>
      </td>
    </tr>
  );
}

const LessonLabel = () => <Label>Lesson:</Label>;
