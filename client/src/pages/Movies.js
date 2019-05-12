import React, { Component } from 'react';

import '../index.css';
import './Movies.css';

import AuthContext from '../context/auth-context';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import { release } from 'os';

class MoviesPage extends Component {
  state = {
    creating: false,
    movies: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleEL = React.createRef();
    this.yearEL = React.createRef();
    this.releasedEL = React.createRef();
    this.plotEL = React.createRef();
  }

  componentDidMount() {
    this.fetchMovies();
  }

  startCreateMovieHandler = () => {
    this.setState({creating: true});
  }

  modalConfirmHandler = () => {
    const title = this.titleEL.current.value;
    const year = this.yearEL.current.value;
    const released = this.releasedEL.current.value;
    const plot = this.plotEL.current.value;

    if (
      title.trim().length === 0 ||
      year.trim().length === 0 ||
      released.trim().length === 0 ||
      plot.trim().length === 0
    ) {
      return;
    }

    const movie = { title, year, released, plot };

    const requestBody = {
      query: `
        mutation {
          createMovie(movieInput: {
            title: "${title}",
            year: "${year}",
            released: "${released}",
            plot: "${plot}"
          }) {
            _id
            title
            year
            released
            plot
            creator {
              _id
              pseudo
              email
            }
          }
        }
      `
    };

    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(resData => {
      this.fetchMovies();
    }).catch(err => {
      console.log(err);
    });

    this.setState({creating: false});
  }

  modalCancelHandler = () => {
    this.setState({creating: false});
  }

  fetchMovies() {
    const requestBody = {
      query: `
        query {
          movies {
            _id
            title
            year
            released
            plot
            creator {
              pseudo
              email
            }
          }
        }
      `
    };

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
      const movies = resData.data.movies;
      this.setState({movies: movies});
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    const moviesList = this.state.movies.map(movie => {
      return <li key={movie._id} className="movies_list-item">{movie.title}</li>;
    });

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add movie"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="year">Year</label>
                <input type="number" id="year" ref={this.yearEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="released">Released date</label>
                <input type="date" id="released" ref={this.releasedEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="plot">Summary</label>
                <textarea id="plot" row="4" ref={this.plotEL}></textarea>
              </div>
            </form>
          </Modal>
        )}
        <div>
          <h2>All Movies</h2>
          {this.context.token && (<div className="form-actions">
            <button onClick={this.startCreateMovieHandler}>Create Movie</button>
          </div>)}
          <ul className="movies_list">
            {moviesList}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default MoviesPage;
