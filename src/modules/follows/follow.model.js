const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const followSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
followSchema.plugin(toJSON);
followSchema.plugin(paginate);

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
