import {useAppSelector} from '../app/hooks';
import {selectLesson} from '../app/selectors';

export function Quiz() {
  const lesson = useAppSelector(selectLesson);
  if (!lesson) {
    return (
      <div>
        No lesson selected
      </div>
    );
  }
  return (
    <div>
      {lesson.name}
    </div>
  );
}
