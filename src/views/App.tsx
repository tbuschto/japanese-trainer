import {ConnectedRouter} from 'connected-react-router';
import {Route, Switch} from 'react-router';
import {Lessons} from './Lessons';
import {Settings} from './Settings';
import {Quiz} from './Quiz';
import {Edit} from './Edit';
import {NavPoint} from './NavPoint';
import {RootPath} from '../app/types';
import {trainer} from '../app/JapaneseTrainer';

export function App() {
  return (
    <>
      <ConnectedRouter history={trainer.history}>
        <>
          <nav>
            <span className='logo'>くそ日本語</span>
            <NavPoint to={RootPath.Lessons}>Lessons</NavPoint>
            <NavPoint to={RootPath.Quiz}>Quiz</NavPoint>
            <NavPoint to={RootPath.Settings}>Settings</NavPoint>
            <NavPoint to={RootPath.Edit}>Edit</NavPoint>
          </nav>
          <Switch>
            <Route exact path={RootPath.Home}><Lessons/></Route>
            <Route path={RootPath.Settings}><Settings/></Route>
            <Route path={RootPath.Lessons}><Lessons/></Route>
            <Route path={RootPath.Lookup}>Lookup</Route>
            <Route path={RootPath.Quiz}><Quiz/></Route>
            <Route path={RootPath.Rename}>Rename</Route>
            <Route path={RootPath.Edit}><Edit/></Route>
            <Route path='*'>Page not found</Route>
          </Switch>
        </>
      </ConnectedRouter>
    </>
  );
}
