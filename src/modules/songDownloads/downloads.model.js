const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const downloadSongsSchema = mongoose.Schema(
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
downloadSongsSchema.plugin(toJSON);

const DownloadedSongs = mongoose.model('DownloadedSongs', downloadSongsSchema);

module.exports = DownloadedSongs;
