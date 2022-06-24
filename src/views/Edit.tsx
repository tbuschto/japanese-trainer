import {EditQuestion} from './EditQuestion';
import {LessonOverview} from './LessonOverview';
import {useAppSelector as $} from '../app/hooks';
import {selectCurrentLesson, selectEditingTarget} from '../app/selectors';

export function Edit() {
  if (!$(selectCurrentLesson)) {
    return <main>No lesson selected</main>;
  }
  if (typeof $(selectEditingTarget) === 'number') {
    return <main><EditQuestion/></main>;
  }
  return <main><LessonOverview/></main>;
}
