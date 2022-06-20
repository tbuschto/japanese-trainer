import {LessonNameRow} from './LessonNameRow';
import {useAppSelector} from '../app/hooks';
import {selectCurrentLesson} from '../app/selectors';

export function Edit() {
  const lesson = useAppSelector(selectCurrentLesson);
  if (!lesson) {
    return <main>No lesson selected</main>;
  }
  return (
    <main>
      <table>
        <tbody>
          <LessonNameRow/>
        </tbody>
      </table>
    </main>
  );
}

