# Movie GraphQL Express server

Server side for a simple movie rating project

Stack: Node + Express + MongoDB (Mongoose) + GraphQL

## Dependencies

Here's the list of manual dependencies install for this project

```bash
npm install --save express
npm install --save express-graphql
npm install --save graphql
npm install --save body-parser
npm install --save mongoose
npm install --save bcryptjs
npm install --save jsonwebtoken
npm install --save dataloader

npm install --save-dev nodemon
```

## Setup

Git clone this project

Install dependencies

```bash
npm i
```

Configure environment variables

```bash
cp nodemon.example.json nodemon.json
```

Then launch the project with npm

```bash
npm start
```

## GraphQL

GraphQL is an awesome query langage which always require HTTP _POST_ to make it works.

Here's examples from what you can do on this small project:

### mutation createMovie

```json
mutation {
  createMovie(movieInput: {
    title: "Star wars"
    year: "1977"
    released:  "19 Oct 1977"
    plot: "Simple galactic war story"
    poster: ""
    duration: ""
    director: ""
    actors: ""
    country: ""
    type: ""
    production: ""
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
