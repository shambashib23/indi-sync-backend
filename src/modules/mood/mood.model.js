const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const moodSchema = mongoose.Schema(
  {
    title: {
      type: String
    },
    imageUrl: {
      type: String,
      default: "nyc3.digitaloceanspaces.com/indiesync/short-haired-girl-good-mood-listening-song-headphones-cheerful-woman-grey-hoodie-smiles-enjoys-music-pink-isolated-background.jpg"
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
moodSchema.plugin(toJSON);
moodSchema.plugin(paginate);

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;
