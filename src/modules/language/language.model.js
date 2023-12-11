const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const languageSchema = mongoose.Schema(
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
languageSchema.plugin(toJSON);
languageSchema.plugin(paginate);

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
