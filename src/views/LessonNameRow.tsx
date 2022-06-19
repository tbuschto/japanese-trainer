import {Action} from './Action';
import {Label, LESSON} from './styles';
import {cancelEdit, acceptInput, editName, handleInput} from '../app/actions';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {selectEditingTarget, selectEditingValue, selectLesson} from '../app/selectors';

export function LessonNameRow() {
  const editing = useAppSelector(selectEditingTarget);
  return editing === 'name'
    ? <NameEditRow/>
    : <NameViewRow/>;
}

function NameViewRow() {
  const lesson = useAppSelector(selectLesson)!;
  return (
    <tr>
      <td>
        <LessonLabel/>
      </td>
      <td>
        <span className={LESSON}>
          {lesson.name}
        </span>
      </td>
      <td>
        <Action action={editName}>Edit</Action>
      </td>
      <td></td>
    </tr>
  );
}

function NameEditRow() {
  const lesson = useAppSelector(selectLesson)!;
  const newName = useAppSelector(selectEditingValue)!;
  const dispatch = useAppDispatch();
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      dispatch(acceptInput());
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
      <td>
        <input
          className={LESSON}
          type='text'
          spellCheck={false}
          onChange={handleInput(dispatch)}
          onKeyDown={keyHandler}
          placeholder={lesson.name}
          value={newName}
          autoFocus/>
      </td>
      <td>
        <Action action={acceptInput}>Save</Action>
      </td>
      <td>
        <Action action={cancelEdit}>Cancel</Action>
      </td>
    </tr>
  );
}

const LessonLabel = () => <Label>Lesson&nbsp;Name:</Label>;
