import {focusable} from './focusable';
import {Action as ReduxAction} from '../app/Action';
import {useAppDispatch} from '../app/hooks';

const SPACE = ' ';

export interface ActionProperties {
  action: () => ReduxAction;
  children: string;
  id?: string;
  enabled?: boolean;
}

export function Action({children: text, action, enabled, id}: ActionProperties) {
  const dispatch = useAppDispatch();
  const disabled = enabled === false;
  const keyHandler = async (ev: React.KeyboardEvent) => {
    if (disabled) {
      return;
    }
    if (ev.key === 'Enter' || ev.key === SPACE) {
      await dispatch(action());
    }
  };
  const state = disabled ? 'disabled' : 'enabled';
  return (
    <span {...focusable({id, tabIndex: 0})}
        className={`action ${state}`}
        onClick={() => disabled || dispatch(action())}
        onKeyUp={keyHandler}>
      {text}
    </span>
  );
}
