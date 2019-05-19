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
  movie: async args => {
    try {
      const movie = await Movie.findOne({_id: args.movieId});
      return transformMovie(movie);
    }
    catch (err) {
      throw err;
    }
  },
  createMovie: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const movie = new Movie({
      title: args.movieInput.title,
      year: args.movieInput.year,
      released: args.movieInput.released,
      plot: args.movieInput.plot,
      creator: req.userId
    });
    let createdMovie;
    try {
      const result = await movie
        .save()
          createdMovie = transformMovie(result);
          const creator = await User.findById(req.userId);

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
