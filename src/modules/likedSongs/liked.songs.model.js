const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const likeSongsSchema = mongoose.Schema(
  {
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
likeSongsSchema.plugin(toJSON);
likeSongsSchema.plugin(paginate);

const LikedSongs = mongoose.model('LikedSongs', likeSongsSchema);

module.exports = LikedSongs;
