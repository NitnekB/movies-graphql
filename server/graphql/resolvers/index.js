const bcrypt = require('bcryptjs');

// Models
const Movie = require('../../models/movie');
const User = require('../../models/user');

const movies = async movieIds => {
  try {
    const movies = await Movie.find({ _id: { $in: movieIds } });
    return movies.map(movie => {
      return {
        ...movie._doc,
        _id: movie.id,
        creator: user.bind(this, movie.creator)
      };
    });
  }
  catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdMovies: movies.bind(this, user._doc.createdMovies)
    };
  }
  catch (err) {
    throw err;
  }
};

module.exports = {
  movies: async () => {
    try {
      const movies = await Movie.find().populate('creator');
      return movies.map(movie => {
        return {
          ...movie._doc,
          _id: movie.id,
          creator: user.bind(this, movie._doc.creator)
        };
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
      plot: args.movieInput.plot,
      creator: '5cd4aafcf4157a4b7f5b35a1'
    });
    let createdMovie;
    try {
      const result = await movie
        .save()
          createdMovie = {
            ...result._doc,
            _id: movie._doc._id.toString(),
            creator: user.bind(this, result._doc.creator)
          };
          const creator = await User.findById('5cd4aafcf4157a4b7f5b35a1');

          if (!creator) {
            throw new Error('User not found!');
          }
          creator.createdMovies.push(movie);
          await creator.save();

          return createdMovie;
    } catch(err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error('User with this email exists already!');
      }
      const hashedPassword = await bcrypt
        .hash(args.userInput.password, 12);
      const user = new User({
        pseudo: args.userInput.pseudo,
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = user.save();
      return { ...result._doc, password: null, _id: result.id };
    }
    catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find().populate('createdMovies');
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          password: null,
          createdMovies: movies.bind(this, user._doc.createdMovies)
        };
      });
    }
    catch (err) {
      throw err;
    }
  }
};
