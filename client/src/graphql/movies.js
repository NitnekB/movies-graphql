export const createMovieMutation = movie => {
  return {
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
      title: movie.title,
      year: movie.year,
      released: movie.released,
      plot: movie.plot,
      poster: movie.poster,
      duration: movie.duration,
      director: movie.director,
      actors: movie.actors,
      country: movie.country,
      type: movie.type,
      production: movie.production
    }
  }
};

export const movieQuery = {
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

export const movieDetailQuery = movieId => {
  return {
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
      movieId: movieId
    }
  }
};

export const deleteMovieMutation = movieId => {
  return {
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
      movieId: movieId
    }
  }
};
