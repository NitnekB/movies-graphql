import React, { Component } from 'react';

import '../index.css';
import './Movies.css';

import AuthContext from '../context/auth-context';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import MovieList from '../components/Movies/MovieList/MovieList';
import Spinner from '../components/Spinner/Spinner';

class MoviesPage extends Component {
  state = {
    creating: false,
    movies: [],
    isLoading: false
  };
  isActive = true;

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
      this.setState(prevState => {
        const updatedMovies = [...prevState.movies];
        updatedMovies.push({
          _id: this.context.userId,
          title: resData.data.createMovie.title,
          year: resData.data.createMovie.year,
          released: resData.data.createMovie.released,
          plot: resData.data.createMovie.plot,
          creator: {
            _id: this.context.userId,
            pseudo: resData.data.createMovie.creator.pseudo
          }
        });
        return { movies: updatedMovies };
      });
    }).catch(err => {
      console.log(err);
    });

    this.setState({ creating: false });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false });
  }

  fetchMovies() {
    this.setState.isLoading = true;

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
              _id
              pseudo
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
      if (this.isActive) {
        this.setState({ movies: movies, isLoading: false });
      }
    }).catch(err => {
      console.log(err);
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
    });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
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
          {this.state.isLoading ? (
            <Spinner />
          ) : <MovieList movies={this.state.movies} />}
        </div>
      </React.Fragment>
    );
  }
}

export default MoviesPage;
