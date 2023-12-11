const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const genreSchema = mongoose.Schema(
  {
    title: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
genreSchema.plugin(toJSON);
genreSchema.plugin(paginate);

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
