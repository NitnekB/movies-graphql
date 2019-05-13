import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

import '../index.css';
import './Auth.css';

class AuthPage extends Component {
  state = {
    isLogin: false
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

  submitHandler = (event) => {
    event.preventDefault();

    const pseudo = this.pseudoEl.current ? this.pseudoEl.current.value : '';
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($pseudo: String!, $email: String!, $password: String!) {
            createUser(userInput: {pseudo: $pseudo, email: $email, password: $password}) {
              _id
              pseudo
              email
            }
          }
        `,
        variables: {
          pseudo: pseudo,
          email: email,
          password: password
        }
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(resData => {
      if (resData.data.login.token) {
        this.context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        );
      }
    }).catch(err => {
      console.log(err);
    })
  };

  render() {
    return (
      <div className="auth-main">
        <div className="black-fog">
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
          </form>
        </div>
      </div>
    );
  }
}

export default AuthPage;
