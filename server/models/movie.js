const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  released: {
    type: String,
    required: false
  },
  plot: {
    type: String,
    required: false
  },
  poster: {
    type: String,
    required: false
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Movie', movieSchema);
