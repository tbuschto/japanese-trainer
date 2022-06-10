import {HomeScreen} from './pages/HomeScreen';
import {ConnectedRouter} from 'connected-react-router'
import {instance} from './app/JapaneseTrainer';
import {Route, Switch} from 'react-router';
import {RootPath} from './app/types';
import {NavBar} from './pages/NavBar';

export function App() {
  return (
    <>
      <ConnectedRouter history={instance.history}>
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

// https://github.com/supasate/connected-react-router/issues/570
declare module 'connected-react-router' {

  interface ConnectedRouterProps {
    children?: JSX.Element;
  }

}

// declare module 'history' {

//   type LocationState = 'foo'

// }
