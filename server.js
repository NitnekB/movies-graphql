const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery {
        movies: [String!]!
      }

      type RootMutation {
        createMovie(title: String): String
      }

      schema{
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      movies: () => {
        return ['Star wars', 'Batman', 'Kappa'];
      },
      createMovie: (args) => {
        const movieTitle = args.title;
        return movieTitle;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
