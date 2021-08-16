import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom"
import useSocketConnection from 'hooks/useSocketConnection';
import IndexPage from "pages/IndexPage"
import ConnectionTest from 'pages/ConnectionTest';

function App() {
  useSocketConnection();

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <IndexPage/>
        </Route>
        <Route path="/connection-test" exact>
          <ConnectionTest/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
