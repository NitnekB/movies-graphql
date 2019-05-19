import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import MainFooter from './components/Footer/MainFooter';

import AuthContext from './context/auth-context';

import AuthPage from './pages/Auth';
import UserProfilePage from './pages/UserProfile';
import MoviesPage from './pages/Movies/Movies';
import AboutUsPage from './pages/AboutUs';
import SitemapPage from './pages/Sitemap';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/movies" exact />}
                {this.state.token && <Redirect from="/auth" to="/movies" exact />}
                {!this.state.token && <Route path="/auth" component={AuthPage} />}
                <Route path="/movies" component={MoviesPage} />
                {this.state.token && <Route path="/profile" component={UserProfilePage} />}
                <Route path="/about" component={AboutUsPage} />
                <Route path="/sitemap" component={SitemapPage} />
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
            <MainFooter />
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
