import {useAppSelector} from '../app/hooks';
import {selectCurrentLesson} from '../app/selectors';

export function Quiz() {
  const lesson = useAppSelector(selectCurrentLesson);
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
