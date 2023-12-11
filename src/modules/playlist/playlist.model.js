const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String
    },
    playlistImage: {
      type: String,
      default: ""
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);


const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
