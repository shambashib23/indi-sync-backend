const { Song } = require("../song");
const Mood = require("./mood.model")

const addMood = async (createBody) => {
  const mood = await Mood.create(createBody);
  return mood;
}

const getAllMoods = async () => {
  const moods = await Mood.find();
  return moods;
}

const getTopMoods = async () => {
  const topMoods = await Song.aggregate([
    {
      $lookup: {
        from: 'moods',
        localField: 'moods',
        foreignField: '_id',
        as: 'moods'
      }
    },
    {
      $unwind: '$moods' // Unwind the moods array
    },
    {
      $group: {
        _id: '$moods',
        count: { $sum: 1 } // Count the number of songs for each mood
      }
    },
    {
      $sort: { count: -1 } // Sort in descending order based on the count
    },
    {
      $limit: 10 // Adjust the limit based on your requirement
    }
  ]);

  return topMoods;
}


module.exports = {
  addMood,
  getAllMoods,
  getTopMoods
}