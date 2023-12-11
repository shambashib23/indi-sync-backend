const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const tagSchema = mongoose.Schema(
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
tagSchema.plugin(toJSON);
tagSchema.plugin(paginate);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
