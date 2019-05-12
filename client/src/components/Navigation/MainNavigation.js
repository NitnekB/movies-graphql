import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

import AuthContext from '../../context/auth-context';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation_logo">
            <h1>Movie Ratings</h1>
          </div>
          <nav className="main-navigation_items">
            <ul>
              <li>
                <NavLink to="/movies">Movies</NavLink>
              </li>
              {!context.token && (
                <li>
                  <NavLink className="logout" to="/auth">Sign in / Sign up</NavLink>
                </li>
              )}
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink className="profile" to="/profile">My profile</NavLink>
                  </li>
                  <li>
                    <button className="logout" onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      )
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
