import {push} from 'connected-react-router';
import {useAppDispatch} from '../app/hooks';
import {RootPath} from '../app/types';

export const NavBar = () => (
  <div className='navBar'>
    <NavPoint to={RootPath.Lessons}>Lessons</NavPoint>
    <NavPoint to={RootPath.Quiz}>Quiz</NavPoint>
    <NavPoint to={RootPath.Settings}>Settings</NavPoint>
    <NavPoint to={RootPath.Edit}>Edit</NavPoint>
  </div>
);

const NavPoint = ({to, children}: {to: RootPath, children: string}) => {
  const dispatch = useAppDispatch();
  return <span className='navPoint' onClick={() => dispatch(push(to))}>
    {children}
  </span>;
};
