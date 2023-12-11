const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

const pricingPlanSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    default: 0
  },
  isChecked: {
    type: Boolean,
    default: false
  }
  // Add any other fields relevant to your pricing plan
});

const songSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    coverImage: {
      type: String,
      default: ""
    },
    trackName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    tempo: {
      type: Number
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre'
    },
    moods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mood'
      }
    ],
    tags: {
      type: [{
        type: String
      }],
      validate: {
        validator: function (array) {
          return array.length <= 10;
        },
        message: 'Tags must not exceed 10 elements.',
      },
    },
    description: {
      type: String
    },
    copyrightHolder: {
      type: String
    },
    releaseDate: {
      type: Date,
    },
    songLanguage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language'
    },
    songDuration: {
      type: Number
    },
    numberOfLikes: {
      type: Number,
      default: 0
    },
    numberOfPlays: {
      type: Number,
      default: 0
    },
    numberOfDownloads: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0
    },
    isFreeDownload: {
      type: Boolean,
      default: false
    },
    isPromoted: {
      type: Boolean,
      default: false
    },
    basicPlan: {
      type: pricingPlanSchema,
    },
    premiumPlan: {
      type: pricingPlanSchema
    },
    unlimitedPlan: {
      type: pricingPlanSchema
    },
    exclusivePlan: {
      type: pricingPlanSchema
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
songSchema.plugin(toJSON);
songSchema.plugin(paginate);
songSchema.plugin(mongoosePaginate);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
