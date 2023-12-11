const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const cartSchema = mongoose.Schema(
  {
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    license:
    {
      _id: mongoose.Schema.Types.ObjectId,
      licenseType: String,
      price: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

const LikedSongs = mongoose.model('Cart', cartSchema);

module.exports = LikedSongs;
