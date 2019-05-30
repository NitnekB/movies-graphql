import React, { Component } from 'react';

import '../../index.css';
import './Movies.css';

import AuthContext from '../../context/auth-context';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import MovieList from '../../components/Movies/MovieList/MovieList';
import Spinner from '../../components/Spinner/Spinner';

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
    this.posterEL = React.createRef();
    this.durationEL = React.createRef();
    this.directorEL = React.createRef();
    this.actorsEL = React.createRef();
    this.countryEL = React.createRef();
    this.typeEL = React.createRef();
    this.productionEL = React.createRef();
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
    const poster = this.posterEL.current.value;
    const duration = this.durationEL.current.value;
    const director = this.directorEL.current.value;
    const actors = this.actorsEL.current.value;
    const country = this.countryEL.current.value;
    const type = this.typeEL.current.value;
    const production = this.productionEL.current.value;

    if (
      title.trim().length === 0 ||
      year.trim().length === 0 ||
      released.trim().length === 0 ||
      plot.trim().length === 0
    ) {
      return;
    }

    const movie = {
      title,
      year,
      released,
      plot,
      poster,
      duration,
      director,
      actors,
      country,
      type,
      production
    };

    const requestBody = {
      query: `
        mutation CreateMovie(
          $title: String!,
          $year: String!,
          $released: String!,
          $plot: String!,
          $poster: String!,
          $duration: String!,
          $director: String!,
          $actors: String!,
          $country: String!,
          $type: String!,
          $production: String!
        ) {
          createMovie(movieInput: {
            title: $title,
            year: $year,
            released: $released,
            plot: $plot,
            poster: $poster,
            duration: $duration,
            director: $director,
            actors: $actors,
            country: $country,
            type: $type,
            production: $production
          }) {
            _id
            title
            year
            creator {
              _id
              pseudo
            }
          }
        }
      `,
      variables: {
        title: title,
        year: year,
        released: released,
        plot: plot,
        poster: poster,
        duration: duration,
        director: director,
        actors: actors,
        country: country,
        type: type,
        production: production
      }
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
                <input type="text" id="year" ref={this.yearEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="released">Released date</label>
                <input type="date" id="released" ref={this.releasedEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="poster">Poster image link</label>
                <input type="text" id="poster" ref={this.posterEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="plot">Summary</label>
                <textarea id="plot" row="4" ref={this.plotEL}></textarea>
              </div>
              <div className="form-control">
                <label htmlFor="duration">Duration (in minutes)</label>
                <input type="text" id="duration" ref={this.durationEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="director">Director</label>
                <input type="text" id="director" ref={this.directorEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="actors">Main actors</label>
                <input type="text" id="actors" ref={this.actorsEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="country">Country</label>
                <input type="text" id="country" ref={this.countryEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="type">Media type (Tv show, movie...)</label>
                <input type="text" id="type" ref={this.typeEL}></input>
              </div>
              <div className="form-control">
                <label htmlFor="production">Production society</label>
                <input type="text" id="production" ref={this.productionEL}></input>
              </div>
            </form>
          </Modal>
        )}
        <div>
          <h2>All Movies</h2>
          {this.context.token && (<div className="form-actions movie-create-btn">
            <button id="create-movie" onClick={this.startCreateMovieHandler}>Create Movie</button>
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
