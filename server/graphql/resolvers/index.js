const userResolver = require('./users');
const movieResolver = require('./movies');

const rootResolver = {
  ...userResolver,
  ...movieResolver
};

module.exports = rootResolver;
