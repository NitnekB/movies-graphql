import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainFooter.css';

const MainFooter = props => (
  <header className="main-footer">
    <nav className="main-footer_items">
      <ul>
        <li>
          <NavLink to="/sitemap">Sitemap</NavLink>
        </li>
        <li>
          <NavLink to="/about">About us</NavLink>
        </li>
      </ul>
    </nav>
    <div className="main-footer_logo">
      <h2>Logo Movie Ratings app</h2>
    </div>
  </header>
);

export default MainFooter;
