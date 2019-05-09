# Movies Graphql API

Node, Mongo, Graphql, React are awesome!

Let's create something fun and learn things!!!

## Functionalities

1 - User

- Create user
- Login

2 - Movies

- Create a new movie
- Read movies a a specific one
- Update a specific movie
- Delete a specific movie

A movie belongs to a user

- Can be filter movies

## GraphQL

Example of movie mutation

```json
mutation {
  createMovie(movieInput: {
    title: "Star wars"
    year: 1977
    plot: "Simple galactic war story"
  }) {
    _id
    title
    year
    plot
  }
}
```

Example of movies Query

```json
query {
  movies {
    _id
    title
    year
    plot
  }
}
```
