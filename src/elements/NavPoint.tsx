import {push} from 'connected-react-router';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {RootPath} from '../app/AppState';
import {CLASS_NAV_POINT, CLASS_SELECTED} from '../app/cssClassNames';

export const NavPoint = ({to, children}: {to: RootPath, children: string}) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector(state => state.router.location.pathname);
  const className = CLASS_NAV_POINT + (current === to ? ' ' + CLASS_SELECTED : '');
  return <span
    className={className}
    tabIndex={0}
    onClick={() => dispatch(push(to))}>
    {children}
  </span>;
};
