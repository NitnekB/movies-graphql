import React, { Component } from 'react';

import '../index.css';
import './UserProfile.css';

import { userProfileQuery, userCredentialsMutation } from '../graphql/auth';

import AuthContext from '../context/auth-context';
import { authenticationFetcher } from '../context/access-point';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class UserProfilePage extends Component {
  state = {
    updating: false,
    profile: {}
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.curPasswordEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  startUserUpdateHandler = () => {
    this.setState({ updating: true });
  }

  modalConfirmHandler = async () => {
    const userId = this.context.userId;
    const curPassword = this.curPasswordEl.current.value;
    const newPassword = this.passwordEl.current.value;

    if (
      curPassword.trim().length === 0 ||
      newPassword.trim().length === 0
    ) {
      return;
    }

    const credentials = {
      userId,
      curPassword,
      newPassword
    }

    const requestBody = userCredentialsMutation(credentials);

    try {
      const res = await authenticationFetcher(requestBody, this.context.token);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      await res.json();
    } catch(err) {
      console.log(err);
      throw err;
    }
    this.setState({ updating: false });
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

  modalCancelHandler = () => {
    this.setState({ updating: false });
  }

  render() {
    const { profile } = this.state;
    return (
      <React.Fragment>
        {this.state.updating && <Backdrop />}
        {this.state.updating && (
          <Modal
            title="Update password"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="cur-password">Current password</label>
                <input type="password" id="cur-password" ref={this.curPasswordEl}></input>
              </div>
              <div className="form-control">
                <label htmlFor="new-password">Updated Password</label>
                <input type="password" id="new-password" ref={this.passwordEl}></input>
              </div>
            </form>
          </Modal>
        )}
        <h2>My profile</h2>
        {this.context.token && (
          <React.Fragment>
            <div className="form-actions movie-create-btn">
              <button id="create-movie" onClick={this.startUserUpdateHandler}>Update my password</button>
            </div>
            <div className="general-data">
              <p>Pseudo: {profile.pseudo}</p>
              <p>Email: {profile.email}</p>
              <p>Imported movie count: {profile.numberOfCreatedMovies}</p>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default UserProfilePage;
