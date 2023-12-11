const mongoose = require('mongoose');

const { toJSON, paginate } = require('../../plugins');
const { roles } = require('../../config/roles');

const newsLetterSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);


newsLetterSchema.plugin(toJSON);

const News = mongoose.model('News', newsLetterSchema);

module.exports = News;
