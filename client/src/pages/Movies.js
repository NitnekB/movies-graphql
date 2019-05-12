import React, { Component } from 'react';

import '../index.css';
import './Movies.css';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class MoviesPage extends Component {
  state = {
    creating: false
  };

  startCreateMovieHandler = () => {
    this.setState({creating: true});
  }

  modalConfirmHandler = () => {
    this.setState({creating: false});
  }

  modalCancelHandler = () => {
    this.setState({creating: false});
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && <Modal title="Add movie" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
          <p>Modal content</p>
        </Modal>}
        <div>
          <h2>All Movies</h2>
          <div className="form-actions">
            <button onClick={this.startCreateMovieHandler}>Create Movie</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MoviesPage;
