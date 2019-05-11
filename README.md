# Movies Graphql API

Node, Mongo, Graphql, React are awesome!

Let's create something fun and learn things!!!

## Functionalities

1 - User

- Create user
- Login using _jwt_

2 - Movies

- Create a new movie
- Read a specific movie
- Fetch all movies
- Update a specific movie
- Delete a specific movie

A movie belongs to a user

## GraphQL

GraphQL is an awesome query langage which always require HTTP _POST_ to make it works.

Here's examples from what you can do on this small project:

### mutation createMovie

```json
mutation {
  createMovie(movieInput: {
    title: "Star wars"
    year: 1977
    released:  "19 Oct 1977"
    plot: "Simple galactic war story"
  }) {
    _id
    title
    year
    plot
  }
}
```

### mutation createUser

```json
mutation {
  createUser(userInput: {
    email: "toto@toto.com",
    pseudo: "toto",
    password: "toto"
  }) {
    _id
    email
    pseudo
    password
  }
}
```

### query movies

```json
query {
  movies {
    _id
    title
    year
    plot
    released
    creator {
      email
      pseudo
    }
  }
}
```

### query login

```json
query {
  login(email: "toto@toto.com", password: "toto") {
    userId
    token
    tokenExpiration
  }
}
```

## Dependencies

Here's the list of manual dependencies install for this project

```bash
npm install --save express
npm install --save express-graphql
npm install --save graphql
npm install --save body-parser
npm install --save mongoose
npm install --save bcryptjs
npm install -save jsonwebtoken

npm install --save-dev nodemon
```
