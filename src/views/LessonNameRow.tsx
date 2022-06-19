import {Action} from './Action';
import {Label, LESSON} from './styles';
import {edit, setLessonName} from '../app/actions';
import {useAppDispatch, useInput} from '../app/hooks';
import {Lesson, EditingTarget} from '../app/types';

export function LessonNameRow(props: {lesson: Lesson, editing: EditingTarget}) {
  return props.editing === 'name'
    ? <NameEditRow lesson={props.lesson}/>
    : <NameViewRow lesson={props.lesson}/>;
}

function NameViewRow({lesson}: {lesson: Lesson}) {
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
        <Action action={() => edit('name')}>Edit</Action>
      </td>
      <td></td>
    </tr>
  );
}

function NameEditRow({lesson}: {lesson: Lesson}) {
  const newName = useInput(lesson.name);
  const accept = () => setLessonName(newName.get());
  const cancel = () => edit('none');
  const dispatch = useAppDispatch();
  const keyHandler = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      dispatch(accept());
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      dispatch(cancel());
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
          onChange={newName.set}
          onKeyDown={keyHandler}
          placeholder={lesson.name}
          value={newName.get()}
          autoFocus/>
      </td>
      <td>
        <Action action={accept}>Save</Action>
      </td>
      <td>
        <Action action={cancel}>Cancel</Action>
      </td>
    </tr>
  );
}

const LessonLabel = () => <Label>Lesson&nbsp;Name:</Label>;
