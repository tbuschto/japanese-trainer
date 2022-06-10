import {ConnectedRouter} from 'connected-react-router';
import {Route, Switch} from 'react-router';
import {HomeScreen} from './HomeScreen';
import {NavBar} from './NavBar';
import {trainer} from '../app/JapaneseTrainer';
import {RootPath} from '../app/types';

export function App() {
  return (
    <>
      <ConnectedRouter history={trainer.history}>
        <>
          <NavBar/>
          <Switch>
            <Route exact path={RootPath.Home}><HomeScreen/></Route>
            <Route path={RootPath.Settings}>Settings</Route>
            <Route path={RootPath.Lessons}>Lessons</Route>
            <Route path={RootPath.Lookup}>Lookup</Route>
            <Route path={RootPath.Quiz}>Quiz</Route>
            <Route path={RootPath.Rename}>Rename</Route>
            <Route path='*'>Page not found</Route>
          </Switch>
        </>
      </ConnectedRouter>
    </>
  );
}

