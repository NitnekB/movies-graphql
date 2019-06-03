import React, { Component } from 'react';

import { loginQuery, createUserMutation } from '../graphql/auth';

import AuthContext from '../context/auth-context';
import { publicFetcher } from '../context/access-point';

import '../index.css';
import './Auth.css';

class AuthPage extends Component {
  state = {
    isLogin: false,
    hasError: false,
    errorInfo: null
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.pseudoEl = React.createRef();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  }

  submitHandler = async event => {
    event.preventDefault();

    this.setState({
      hasError: false,
      errorInfo: null
    });

    const pseudo = this.pseudoEl.current ? this.pseudoEl.current.value : '';
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = loginQuery(email, password);

    if (this.state.isLogin) {
      if (pseudo.trim().length === 0) {
        return;
      }
      requestBody = createUserMutation(pseudo, email, password);
    }

    try {
      const res = await publicFetcher(requestBody);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }

      const result = await res.json();

      if ('errors' in result) {
        this.setState(prevState => {
          return {
            hasError: !prevState.hasError,
            errorInfo: result.errors[0].message
          };
        });
      }

      if (result.data.login.token) {
        this.context.login(
          result.data.login.token,
          result.data.login.userId,
          result.data.login.tokenExpiration
        );
      }
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="auth-main">
        <div className="background black-fog noise">
          <form className="authForm" onSubmit={this.submitHandler}>
            <h2>Welcome! Please {this.state.isLogin ? 'Sign up' : 'Sign in'}</h2>
            {this.state.isLogin ?
              <div className="form-control">
                <label htmlFor="pseudo">Pseudo</label>
                <input type="pseudo" id="pseudo" ref={this.pseudoEl}></input>
              </div> :
              ''
            }
            <div className="form-control">
              <label htmlFor="email">E-Mail</label>
              <input type="email" id="email" ref={this.emailEl}></input>
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={this.passwordEl}></input>
            </div>
            <div className="form-actions">
              <button type="submit">{this.state.isLogin ? 'Create your account' : 'Connect'}</button>
              <button type="button" onClick={this.switchModeHandler}>
                Switch to {this.state.isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
            <div>
            {this.state.hasError &&
              <span className="error">{this.state.errorInfo}</span>
            }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AuthPage;
