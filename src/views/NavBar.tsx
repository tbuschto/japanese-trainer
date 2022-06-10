import {push} from 'connected-react-router';
import {useDispatch} from 'react-redux';
import {RootPath} from '../app/types';

export const NavBar = () => (
  <div>
    <Link to={RootPath.Lessons}/>
    <Link to={RootPath.Quiz}/>
    <Link to={RootPath.Settings}/>
    <Link to={RootPath.Edit}/>
  </div>
);

const Link = ({to}: {to: RootPath}) => {
  const dispatch = useDispatch();
  return <a onClick={() => dispatch(push(to))}>{to}</a>;
};
