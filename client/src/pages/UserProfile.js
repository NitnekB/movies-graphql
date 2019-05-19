import React, { Component } from 'react';

import '../index.css';
import './UserProfile.css';

import AuthContext from '../context/auth-context';

class UserProfilePage extends Component {
  state = {
    profile: {}
  };

  static contextType = AuthContext;

  // constructor(props) {
  //   super(props);
  //   this.pseudoEL = React.createRef();
  //   this.emailEL = React.createRef();
  //   this.passwordEL = React.createRef();
  // }

  componentWillMount() {
    const fetchProfile = this.fetchUserProfile();
    if (fetchProfile) {
      this.setState({ profile: fetchProfile });
    }
  }

  fetchUserProfile() {
    const requestBody = {
      query: `
        query User($userId: String!) {
          user(userId: $userId) {
            pseudo
            email
          }
        }
      `,
      variables: {
        userId: this.context.userId
      }
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(resData => {
      const user = resData.data.user;
      this.setState({ profile: user });
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    const { profile } = this.state;
    return (
      <React.Fragment>
        <h2>My profile</h2>
        {this.context.token && (
          <div className="general-data">
            <p>Pseudo: {profile.pseudo}</p>
            <p>Email: {profile.email}</p>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default UserProfilePage;
