import React, { Component } from 'react';

import './MovieDetail.css';

class MovieDetailPage extends Component {
  state = {
    movie: {}
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
          }
        }
      `,
      variables: {
        movieId: this.props.match.params.movieId
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
      console.log("fetchMovie " + movieData);
      this.setState({ movie: movieData });
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    const { movie } = this.state;
    return (
      <React.Fragment>
        <h2>{movie.title}</h2>
        <div className="movie-detail">
          <p>Released date: {movie.released}</p>
          <p>Plot: {movie.plot}</p>
        </div>
      </React.Fragment>
    )
  }
}

export default MovieDetailPage;
