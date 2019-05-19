const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  """
  A MovieType contains persisted attributes for a Movie
  """
  type MovieType {
    "Movie ID generated by MongoDB"
    _id: ID!
    "Title of a movie"
    title: String!
    "Released year"
    year: String!
    "Released date"
    released: String!
    "Small plot about the storyline"
    plot: String!
    "Added by this user"
    creator: UserType!
  }

  """
  A UserType contains persisted attributes for a User
  """
  type UserType {
    "User ID generated by MongoDB"
    _id: ID!
    "Pseudo of the user"
    pseudo: String!
    "Email of the user"
    email: String!
    "Encrypted password"
    password: String
    "User references for all movies he has been created"
    createdMovies: [MovieType!]!
  }

  """
  AuthDataType contains authentication attributes
  """
  type AuthDataType {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input MovieInput {
    title: String!
    year: String!
    released: String!
    plot: String!
  }

  input UserInput {
    pseudo: String!
    email: String!
    password: String!
  }

  type RootQuery {
    movies: [MovieType!]!
    users: [UserType!]!
    user(userId: String!): UserType
    login(email: String!, password: String!): AuthDataType
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
