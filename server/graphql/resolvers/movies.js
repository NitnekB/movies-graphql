const Movie = require('../../models/movie');
const User = require('../../models/user');

const { transformMovie } = require('./handler');

module.exports = {
  movies: async () => {
    try {
      const movies = await Movie.find().populate('creator');
      return movies.map(movie => {
        return transformMovie(movie);
      });
    }
    catch (err) {
      throw err;
    }
  },
  createMovie: async args => {
    const movie = new Movie({
      title: args.movieInput.title,
      year: args.movieInput.year,
      released: args.movieInput.released,
      plot: args.movieInput.plot,
      creator: '5cd5e44ea875e9598a963eec'
    });
    let createdMovie;
    try {
      const result = await movie
        .save()
          createdMovie = transformMovie(result);
          const creator = await User.findById('5cd5e44ea875e9598a963eec');

          if (!creator) {
            throw new Error('User not found!');
          }
          creator.createdMovies.push(movie);
          await creator.save();

          return createdMovie;
    } catch(err) {
      throw err;
    }
  }
};
