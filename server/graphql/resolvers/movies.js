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
      poster: args.movieInput.poster,
      creator: req.userId,
      duration: args.movieInput.duration,
      director: args.movieInput.director,
      actors: args.movieInput.actors,
      country: args.movieInput.country,
      type: args.movieInput.type,
      production: args.movieInput.production
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
  },
  deleteMovie: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const movie = await Movie.findOne({_id: args.movieId});
      if (!movie) {
        throw new Error('Movie not found!');
      }
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error('User not found!');
      }

      if (user !== movie.creator) {
        throw new Error('You are not allowed to delete this movie!')
      }

      await User.updateOne(
        { _id: user._id },
        { $pull: { createdMovies: { $in: [ movie._id ] } } },
        { multi: true }
      )
      await Movie.deleteOne({_id: args.movieId});
    } catch(err) {
      throw err;
    }
  }
};
