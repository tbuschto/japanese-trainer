import {Action as ReduxAction} from '../app/actions';
import {useAppDispatch} from '../app/hooks';

export interface ActionProperties {
  action: ReduxAction;
  children: string;
}

export function Action({children: text, action}: ActionProperties) {
  const dispatch = useAppDispatch();
  return (
    <span className='action' onClick={() => dispatch(action)}>
      {text}
    </span>
  );
}
