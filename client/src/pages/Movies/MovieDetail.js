import React, { Component } from 'react';

import './MovieDetail.css';

import { movieDetailQuery, deleteMovieMutation } from '../../graphql/movies';

import AuthContext from '../../context/auth-context';
import { publicFetcher, authenticationFetcher } from '../../context/access-point';

class MovieDetailPage extends Component {
  state = {
    movie: {},
    user: {},
    isCreator: false
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchMovieDetail();
  }

  fetchMovieDetail = async () => {
    const requestBody = movieDetailQuery(this.props.location.state.movieId);

    try {
      const res = await publicFetcher(requestBody);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      const result = await res.json();

      const movieData = result.data.movie;
      const creatorData = result.data.movie.creator;

      this.setState({
        movie: movieData,
        user: creatorData,
        isCreator: creatorData._id === this.context.userId
      });
    } catch(err) {
      throw err;
    }
  }

  deleteMovieHandler = async () => {
    const requestBody = deleteMovieMutation(this.props.location.state.movieId);

    try {
      const res = await authenticationFetcher(requestBody, this.context.token);

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      this.props.history.push('/movies');
    } catch(err) {
      throw err;
    }
  }

  render() {
    const { movie, user, isCreator } = this.state;
    return (
      <React.Fragment>
      <div className="movie-detail">
        <div className="general-info">
          <h2>{movie.title} - {movie.year}</h2>
          <p>Duration: {movie.duration}</p>
          <p>Director: {movie.director}</p>
          <p>Actors: {movie.actors}</p>
          <p>Released date: {movie.released}</p>
          <p>Plot: {movie.plot}</p>
          <p>Added by: {user.pseudo}</p>
          <p>country: {movie.country}</p>
          <p>Media type: {movie.type}</p>
          <p>Production: {movie.production}</p>
        </div>
        <div className="poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
      </div>
      {isCreator && (
        <div className="form-actions movie-delete-btn">
          <button id="delete-movie" onClick={this.deleteMovieHandler.bind(this)}>Delete this Movie</button>
        </div>
      )}
      </React.Fragment>
    )
  }
}

export default MovieDetailPage;
