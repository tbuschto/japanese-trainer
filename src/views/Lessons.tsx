import {setScreen} from '../app/actions';
import {useAppDispatch} from '../app/hooks';
import {RootPath} from '../app/types';

export function Lessons() {
  const dispatch = useAppDispatch();
  return (
    <div>
      <button onClick={() => dispatch(setScreen(RootPath.Quiz))}>
         Start
      </button>
    </div>
  );
}
