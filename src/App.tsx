import {ConnectedRouter} from 'connected-react-router';
import {Route, Switch} from 'react-router';
import {Lessons} from './views/Lessons/Lessons';
import {Settings} from './views/Settings/Settings';
import {Quiz} from './views/Quiz/Quiz';
import {Edit} from './views/Edit/Edit';
import {NavPoint} from './elements/NavPoint';
import {RootPath} from './app/AppState';
import {trainer} from './app/JapaneseTrainer';
import {CLASS_LOGO} from './app/cssClassNames';

export function App() {
  return (
    <>
      <ConnectedRouter history={trainer.history}>
        <>
          <nav>
            <span className={CLASS_LOGO}>ばか日本語</span>
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
