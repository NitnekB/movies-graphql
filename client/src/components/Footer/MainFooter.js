import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainFooter.css';

const MainFooter = props => (
  <header className="main-footer">
    <div className="foot-lateral">

    </div>
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
    <div className="main-footer_logo foot-lateral">
      <h2>Movie Ratings</h2>
    </div>
  </header>
);

export default MainFooter;
