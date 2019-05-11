import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation_logo">
      <h1>Movie Ratings</h1>
    </div>
    <nav className="main-navigation_items">
      <ul>
        <li>
          <NavLink to="/auth">Authentication</NavLink>
        </li>
        <li>
          <NavLink to="/movies">Movies</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
