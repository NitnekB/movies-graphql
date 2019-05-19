const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { transformUser } = require('./handler');

module.exports = {
  user: async args => {
    try {
      const user = await User.findOne({_id: args.userId});
      return transformUser(user);
    }
    catch (err) {
      throw err;
    }
  },
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
      const result = await newuser.save();
      return { ...result._doc, password: null, _id: result.id };
    }
    catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exists on database!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({userId: user.id, email: user.email}, 'secretkey', {
      expiresIn: '1h'
    });
    return { userId: user.id, token: token, tokenExpiration: 1 }
  }
};
