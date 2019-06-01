import React, { Component } from 'react';

import './MovieDetail.css';

import AuthContext from '../../context/auth-context';

class MovieDetailPage extends Component {
  state = {
    movie: {},
    user: {},
    isCreator: false
  }

  constructor(props) {
    super(props);
    this.deleteMovieHandler = this.deleteMovieHandler.bind(this);
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchMovieDetail();
  }

  fetchMovieDetail() {
    const requestBody = {
      query: `
        query Movie($movieId: String!) {
          movie(movieId: $movieId) {
            title
            year
            released
            plot
            poster
            duration
            director
            actors
            country
            type
            production
            creator {
              _id
              pseudo
            }
          }
        }
      `,
      variables: {
        movieId: this.props.location.state.movieId
      }
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
      const movieData = resData.data.movie;
      const creatorData = resData.data.movie.creator;

      this.setState({
        movie: movieData,
        user: creatorData,
        isCreator: creatorData._id === this.context.userId
      });
    }).catch(err => {
      throw err;
    });
  };

  deleteMovieHandler() {
    const requestBody = {
      query: `
        mutation DeleteMovie(
          $movieId: String!
        ) {
          deleteMovie(movieId: $movieId) {
            _id
          }
        }
      `,
      variables: {
        movieId: this.props.location.state.movieId
      }
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    }).then(() => {
      this.props.history.push('/movies');
    })
  }

  render() {
    const { movie, user, isCreator } = this.state;
    return (
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
        {isCreator && (
          <div className="form-actions movie-delete-btn">
            <button id="delete-movie" onClick={this.deleteMovieHandler}>Delete this Movie</button>
          </div>
        )}
      </div>
    )
  }
}

export default MovieDetailPage;
