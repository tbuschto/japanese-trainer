import {useAppSelector as $} from '../app/hooks';
import {selectInputLessonName} from '../app/selectors';

export const EditQuestion = () => {
  const val = $(selectInputLessonName);
  return (
    <div>{val}</div>
  );
};
