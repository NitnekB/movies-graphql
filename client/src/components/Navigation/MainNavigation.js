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
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authentication</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/movies">Movies</NavLink>
              </li>
              {context.token && (
                <li>
                  <NavLink to="/profile">User profile</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </header>
      )
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
