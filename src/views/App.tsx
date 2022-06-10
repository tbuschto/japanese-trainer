import {ConnectedRouter} from 'connected-react-router';
import {Route, Switch} from 'react-router';
import {Lessons} from './Lessons';
import {NavBar} from './NavBar';
import {Settings} from './Settings';
import {Quiz} from './Quiz';
import {Edit} from './Edit';
import {RootPath} from '../app/types';
import {trainer} from '../app/JapaneseTrainer';

export function App() {
  return (
    <>
      <ConnectedRouter history={trainer.history}>
        <>
          <NavBar/>
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

