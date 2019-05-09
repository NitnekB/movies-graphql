const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const Movie = require('./models/movie');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type MovieType {
        _id: ID!
        title: String!
        year: Int!
        plot: String!
      }

      type UserType {
        _id: ID!
        pseudo: String!
        email: String!
        password: String
      }

      input MovieInput {
        title: String!
        year: Int!
        plot: String!
      }

      input UserInput {
        pseudo: String!
        email: String!
        password: String!
      }

      type RootQuery {
        movies: [MovieType!]!
      }

      type RootMutation {
        createMovie(movieInput: MovieInput): MovieType
        createUser(userInput: UserInput): UserType
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      movies: () => {
        return Movie.find()
          .then(movies => {
            return movies.map(movie => {
              return { ...movie._doc, _id: movie.id };
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
            createdMovie = { ...result._doc, _id: movie._doc._id.toString() };
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
    },
    graphiql: true
  })
);

mongoose.connect(
  `mongodb+srv://${
    process.env.MONGO_USER
  }:${
    process.env.MONGO_PASSWORD
  }@cluster0-hjg7a.mongodb.net/${
    process.env.MONGO_DB
  }?retryWrites=true`,
  { useNewUrlParser: true }
).then(() => {
  app.listen(3000);
}).catch(err => {
  console.log(err);
});
