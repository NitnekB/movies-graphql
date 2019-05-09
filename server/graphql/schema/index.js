const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type MovieType {
    _id: ID!
    title: String!
    year: Int!
    plot: String!
    creator: UserType!
  }

  type UserType {
    _id: ID!
    pseudo: String!
    email: String!
    password: String
    createdMovies: [MovieType!]!
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
`);
