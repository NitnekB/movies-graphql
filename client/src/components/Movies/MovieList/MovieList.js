import React from 'react';

import './MovieList.css';

import MovieItem from './MovieItem/MovieItem';

const movieList = props => {
  const movies = props.movies.map(movie => {
    return (
      <MovieItem
        key={movie._id}
        movieId={movie._id}
        title={movie.title}
        year={movie.year}
        creator={movie.creator}
      />
    );
  });
  return <ul className="movies_list">{movies}</ul>;
}

export default movieList;
