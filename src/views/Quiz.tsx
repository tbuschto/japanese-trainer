import {useAppSelector} from '../app/hooks';
import {selectLesson} from '../app/selectors';

export function Quiz() {
  const lesson = useAppSelector(selectLesson);
  if (!lesson) {
    return (
      <main>
        No lesson selected
      </main>
    );
  }
  return (
    <main>
      {lesson.name}
    </main>
  );
}
