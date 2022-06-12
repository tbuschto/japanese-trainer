import {useAppSelector} from '../app/hooks';
import {selectLesson} from '../app/selectors';

export function Edit() {
  const lesson = useAppSelector(selectLesson);
  return (
    <>
      <div>
      Edit
      </div>
      <div>
        {lesson?.name || 'No lesson selected'}
      </div>
    </>
  );
}
