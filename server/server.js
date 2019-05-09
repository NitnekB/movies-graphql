const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const mongoose = require('mongoose');

const Movie = require('./models/movie');

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

      input MovieInput {
        title: String!
        year: Int!
        plot: String!
      }

      type RootQuery {
        movies: [MovieType!]!
      }

      type RootMutation {
        createMovie(movieInput: MovieInput): MovieType
      }

      schema{
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
      createMovie: (args) => {
        const movie = new Movie({
          title: args.movieInput.title,
          year: args.movieInput.year,
          plot: args.movieInput.plot
        });
        return movie
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: movie._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
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
