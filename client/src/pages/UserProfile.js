import React, { Component } from 'react';

import '../index.css';
import './UserProfile.css';

import { userProfileQuery } from '../graphql/auth';

import AuthContext from '../context/auth-context';
import { authenticationFetcher } from '../context/access-point';

class UserProfilePage extends Component {
  state = {
    profile: {}
  }

  static contextType = AuthContext;

  componentWillMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    const requestBody = userProfileQuery(this.context.userId);

    try {
      const res = await authenticationFetcher(requestBody, this.context.token);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const result = await res.json();
      this.setState({ profile: result.data.user });
    } catch(err) {
      throw err;
    }
  }

  render() {
    const { profile } = this.state;
    return (
      <React.Fragment>
        <h2>My profile</h2>
        {this.context.token && (
          <div className="general-data">
            <p>Pseudo: {profile.pseudo}</p>
            <p>Email: {profile.email}</p>
            <p>Imported movie count: {profile.numberOfCreatedMovies}</p>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default UserProfilePage;
