const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { transformUser } = require('./handler');

module.exports = {
  users: async () => {
    try {
      const users = await User.find().populate('createdMovies');
      return users.map(user => {
        return transformUser(user);
      });
    }
    catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      });
      if (existingUser) {
        throw new Error('User with this email exists already!');
      }
      const hashedPassword = await bcrypt
        .hash(args.userInput.password, 12);
      const newuser = new User({
        pseudo: args.userInput.pseudo,
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = newuser.save();
      return { ...result._doc, password: null, _id: result.id };
    }
    catch (err) {
      throw err;
    }
  }
};
