import React, { Component } from 'react';

import '../../index.css';
import './Movies.css';

import AuthContext from '../../context/auth-context';
import { publicFetcher, authenticationFetcher } from '../../context/access-point';

import { createMovieMutation, movieQuery } from '../../graphql/movies';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import MovieList from '../../components/Movies/MovieList/MovieList';
import Spinner from '../../components/Spinner/Spinner';

class MoviesPage extends Component {
  state = {
    creating: false,
    movies: [],
    isLoading: false
  }
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

  modalConfirmHandler = async () => {
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

    const requestBody = createMovieMutation(movie);

    try {
      const res = await authenticationFetcher(requestBody, this.context.token);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const result = await res.json();

      this.setState(prevState => {
        const updatedMovies = [...prevState.movies];
        updatedMovies.push({
          _id: result.data.createMovie._id,
          title: result.data.createMovie.title,
          year: result.data.createMovie.year,
          released: result.data.createMovie.released,
          creator: {
            _id: this.context.userId,
            pseudo: result.data.createMovie.creator.pseudo
          }
        });
        return { movies: updatedMovies };
      });
    } catch(err) {
      throw err;
    }

    this.setState({ creating: false });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false });
  }

  fetchMovies = async () => {
    this.setState.isLoading = true;

    const requestBody = movieQuery;

    try {
      const res = await publicFetcher(requestBody);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const result = await res.json();

      if (this.isActive) {
        this.setState({
          movies: result.data.movies,
          isLoading: false
        });
      }
    } catch(err) {
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
      throw err;
    }
  }

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
