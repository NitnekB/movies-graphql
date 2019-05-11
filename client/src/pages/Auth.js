import React, { Component } from 'react';

import './Auth.css';

class AuthPage extends Component {
  render() {
    return (
      <div className="main-login">
        <h2>Welcome! Please login</h2>
        <form className="authForm">
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email"></input>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password"></input>
          </div>
          <div className="form-actions">
            <button type="button">Submit</button>
            <button type="button">Switch to Sign up</button>
          </div>
        </form>
      </div>
    );
  }
}

export default AuthPage;
