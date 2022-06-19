import {LessonNameRow} from './LessonNameRow';
import {useAppSelector} from '../app/hooks';
import {selectLesson} from '../app/selectors';

export function Edit() {
  const lesson = useAppSelector(selectLesson);
  if (!lesson) {
    return <main>No lesson selected</main>;
  }
  const editing = useAppSelector(state => state.editing);
  return (
    <main>
      <table>
        <tbody>
          <LessonNameRow lesson={lesson} editing={editing}/>
        </tbody>
      </table>
    </main>
  );
}

