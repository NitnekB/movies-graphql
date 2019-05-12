const DataLoader = require('dataloader');

const Movie = require('../../models/movie');
const User = require('../../models/user');

const { dateToString } = require('../../helpers/date');

const movieLoader = new DataLoader((movieIds) => {
  return movies(movieIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const movies = async movieIds => {
  try {
    const movies = await Movie.find({ _id: { $in: movieIds } });
    return movies.map(movie => {
      return transformMovie(movie);
    });
  }
  catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId);
    return transformUser(user);
  }
  catch (err) {
    throw err;
  }
};

const transformMovie = movie => {
  return {
    ...movie._doc,
    _id: movie.id,
    released: dateToString(movie._doc.released),
    creator: user.bind(this, movie._doc.creator)
  };
}

const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdMovies: () => movieLoader.loadMany(user._doc.createdMovies)
  };
}

exports.transformMovie = transformMovie;
exports.transformUser = transformUser;
