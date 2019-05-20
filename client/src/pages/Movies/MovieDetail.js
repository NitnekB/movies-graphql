import React, { Component } from 'react';

import './MovieDetail.css';

class MovieDetailPage extends Component {
  state = {
    movie: {},
    user: {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const fetchMovie = this.fetchMovieDetail();
    if (fetchMovie) {
      this.setState({ movie: fetchMovie });
    }
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
            creator {
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
      this.setState({
        movie: movieData,
        user: resData.data.movie.creator
      });
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    const { movie, user } = this.state;
    return (
      <div className="movie-detail">
        <div className="general-info">
          <h2>{movie.title}</h2>
          <p>Released date: {movie.released}</p>
          <p>Plot: {movie.plot}</p>
          <p>Added by: {user.pseudo}</p>
        </div>
        <div className="poster">
          <img src={movie.poster}/>
        </div>
      </div>
    )
  }
}

export default MovieDetailPage;
