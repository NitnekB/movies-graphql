const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// TODO: remove this const by mongodb
const moviesArray = [];

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
        return moviesArray;
      },
      createMovie: (args) => {
        const movie = {
          _id: Math.random().toString(),
          title: args.movieInput.title,
          year: args.movieInput.year,
          plot: args.movieInput.plot
        }
        moviesArray.push(movie);
        return movie;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
