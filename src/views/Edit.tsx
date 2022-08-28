import {EditCard} from './EditCard';
import {LessonOverview} from './LessonOverview';
import {useAppSelector as $} from '../app/hooks';
import {selectCurrentLesson, select} from '../app/selectors';

export function Edit() {
  const currentLesson = $(selectCurrentLesson);
  const editingTarget = $(select.editingTarget);
  if (!currentLesson) {
    return <main>No lesson selected</main>;
  }
  if (typeof editingTarget === 'number') {
    return <main><EditCard/></main>;
  }
  return <main><LessonOverview/></main>;
}
