import {push} from 'connected-react-router';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {RootPath} from '../app/AppState';

export const NavPoint = ({to, children}: {to: RootPath, children: string}) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector(state => state.router.location.pathname);
  const className = 'navPoint' + (current === to ? ' selected' : '');
  return <span className={className} onClick={() => dispatch(push(to))}>
    {children}
  </span>;
};
