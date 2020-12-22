import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from '../utils/private-route';
import Home from '../pages/home';
import Play from '../pages/play';
import Dashboard from '../pages/dashboard';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute role="admin" path="/dashboard" component={Dashboard} />
        <PrivateRoute role="player" path="/play" component={Play} />
        <Route exact path="/" component={Home} />
        <Route exact path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
