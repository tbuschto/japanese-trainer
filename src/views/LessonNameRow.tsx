import {Action} from './Action';
import {DATA, Label, LESSON} from './styles';
import {TextInput} from './TextInput';
import {cancelEdit, acceptInputLessonName, editName} from '../app/actions';
import {handleInputLessonName} from '../app/InputHandler';
import {$, _} from '../app/hooks';
import {select, selectCurrentLesson} from '../app/selectors';

export function LessonNameRow() {
  return $(select.editingTarget) === 'name'
    ? <NameEditRow/>
    : <NameViewRow/>;
}

function NameViewRow() {
  const lesson = $(selectCurrentLesson)!;
  return (
    <tr>
      <td colSpan={2} className={DATA}>
        <LessonLabel/>
        <span className={LESSON}>
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
      <td className={DATA}>
        <TextInput
          className={LESSON}
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
