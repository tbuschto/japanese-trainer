import {EditCard} from './EditCard';
import {CardDeckOverview} from './CardDeckOverview';
import {CardCollectionOverview} from './CardCollectionOverview';
import {useAppSelector as $} from '../../app/hooks';
import {selectCurrentLesson, select} from '../../app/selectors';
import {isCardDeck} from '../../app/guards';

export function Edit() {
  const currentLesson = $(selectCurrentLesson);
  const editingTarget = $(select.editingTarget);
  if (!currentLesson) {
    return <main>No lesson selected</main>;
  }
  if (typeof editingTarget === 'object') {
    return <main><EditCard/></main>;
  }
  if (isCardDeck(currentLesson)) {
    return <main><CardDeckOverview/></main>;
  }
  return <main><CardCollectionOverview/></main>;
}
