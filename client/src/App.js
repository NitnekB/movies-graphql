import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import MainFooter from './components/Footer/MainFooter';

import AuthPage from './pages/Auth';
import MoviesPage from './pages/Movies';
import AboutUsPage from './pages/AboutUs';
import SitemapPage from './pages/Sitemap';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route path="/auth" component={AuthPage} />
              <Route path="/movies" component={MoviesPage} />
              <Route path="/about" component={AboutUsPage} />
              <Route path="/sitemap" component={SitemapPage} />
            </Switch>
          </main>
          <MainFooter />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
