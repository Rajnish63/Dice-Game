import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, role, ...restProps }) => {
  const render = (props) => {
    let user = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      if (role === user.role) return <Component {...props} />;
      else return <Redirect to="/" />;
    } else return <Redirect to="/" />;
  };

  return <Route {...restProps} render={render} />;
};

export default PrivateRoute;
