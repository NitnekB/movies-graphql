const bcrypt = require('bcryptjs');

// Models
const Movie = require('../../models/movie');
const User = require('../../models/user');

const movies = movieIds => {
  return Movie.find({_id: {$in: movieIds}})
    .then(movies => {
      return movies.map(movie => {
        return {
          ...movie._doc,
          _id: movie.id,
          creator: user.bind(this, movie.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    })
}

const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        createdMovies: movies.bind(this, user._doc.createdMovies)
      };
    })
    .catch(err => {
      throw err;
    });
};

module.exports = {
  movies: () => {
    return Movie.find().populate('creator')
      .then(movies => {
        return movies.map(movie => {
          return { 
            ...movie._doc,
            _id: movie.id,
            creator: user.bind(this, movie._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      })
  },
  createMovie: args => {
    const movie = new Movie({
      title: args.movieInput.title,
      year: args.movieInput.year,
      plot: args.movieInput.plot,
      creator: '5cd4aafcf4157a4b7f5b35a1'
    });
    let createdMovie;
    return movie
      .save()
      .then(result => {
        createdMovie = {
          ...result._doc,
          _id: movie._doc._id.toString(),
          creator: user.bind(this, result._doc.creator)
        };
        return User.findById('5cd4aafcf4157a4b7f5b35a1');
      })
      .then( user => {
        if (!user) {
          throw new Error('User not found!');
        }
        user.createdMovies.push(movie);
        return user.save();
      })
      .then(result => {
        return createdMovie;
      })
      .catch(err => {
        console.log(err);
        throw err;
    });
  },
  createUser: args => {
    return User.findOne({
      email: args.userInput.email
    }).then(user => {
      if (user) {
        throw new Error('User with this email exists already!')
      }
      return bcrypt
      .hash(args.userInput.password, 12)
    })
    .then(hashedPassword => {
      const user = new User({
        pseudo: args.userInput.pseudo,
        email: args.userInput.email,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
      return { ...result._doc, password: null, _id: result.id }
    })
    .catch(err => {
      throw err;
    });
  }
};
