const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const likeCreatorsSchema = mongoose.Schema(
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
likeCreatorsSchema.plugin(toJSON);
likeCreatorsSchema.plugin(paginate);

const LikedCreators = mongoose.model('LikedCreators', likeCreatorsSchema);

module.exports = LikedCreators;
