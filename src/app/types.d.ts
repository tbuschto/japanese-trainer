declare module 'process/browser'

// https://github.com/supasate/connected-react-router/issues/570
declare module 'connected-react-router' {

  interface ConnectedRouterProps {
    children?: JSX.Element;
  }

}
