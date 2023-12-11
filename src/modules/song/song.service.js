const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const Song = require("./song.model");

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const os = require('os');
const User = require("../user/user.model");
const DownloadedSongs = require("../songDownloads/downloads.model");
const { findCreatorById } = require("../creator/creator.service");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



const fetchRandomSong = async () => {
  const count = await Song.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const randomSong = await Song.findOne().skip(randomIndex);
  return randomSong;
};






const customLabels = {
  totalDocs: 'itemCount',
  docs: 'itemsList',
  limit: 'perPage',
  page: 'currentPage',
  totalPages: 'pageCount',
}

const uploadNewSong = async (creatorId, createBody) => {
  const song = await Song.create({
    ...createBody,
    creator: creatorId
  })
  const creator = await findCreatorById(creatorId);
  creator.numberOfSongsMade += 1;
  await creator.save();
  if (!song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not uploaded")
  }
  return song;
}

const getAllSongs = async (page, limit) => {
  const result = await Song.paginate({}, {
    page,
    limit,
    populate: ['genre', 'creator', 'moods', 'language'],
    customLabels: customLabels
  })
  return result;
}

const getCreatorSongs = async (creatorId, page, limit, sorting = 'desc') => {
  const sort = {};
  if (sorting === 'asc') {
    sort.createdAt = 1;
  }
  if (sorting === 'desc') {
    sort.createdAt = -1;
  }
  const songs = await Song.paginate({
    creator: creatorId
  }, {
    page,
    limit,
    populate: ['genre', 'creator', 'moods', 'language'],
    customLabels: customLabels,
    sort
  })
  return songs;
}

const editSong = async (updateBody, songId) => {
  const song = await Song.findById(songId);
  if (!song) {
    throw new ApiError(httpStatus.NOT_FOUND, "Song does not exist");
  }
  Object.assign(song, updateBody);
  await song.save();
  return song;
};

const getSongById = async (id) => {
  const song = await Song.findById(id);
  return song;
};

const getNumberOfLikes = async (creatorId) => {
  const songs = await Song.find({
    creator: creatorId
  })
  let totalLikes = 0;
  songs.forEach((song) => {
    totalLikes += song.numberOfLikes;
  })
  return totalLikes;
}

const getTopSongs = async (page = 1, limit = 10) => {
  const topSongs = await Song.paginate({}, {
    sort: { numberOfLikes: -1, numberOfPlays: -1 },
    page,
    limit,
    populate: ['genre', 'creator', 'moods', 'language']
  })
  return topSongs;
};

const getSongDetails = async (songId) => {
  const songDetails = await Song.findById(songId).populate('genre').populate('creator').populate('moods').populate('language')
  return songDetails;
}

const searchAndFilterSongs = async (filterBody, page = 1, limit = 10) => {
  const { search, genres, moods, bpm, topSellingMusic, recentlyAddedMusic } = filterBody;
  const filter = {};
  const sort = {}
  let creatorIds = [];
  if (search) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(search, 'i') } },
        { lastName: { $regex: new RegExp(search, 'i') } }
      ]
    }).select('_id');

    creatorIds = users.map(user => user._id);

    filter.$or = [
      { trackName: { $regex: new RegExp(search, 'i') } },
      { creator: { $in: creatorIds } }
    ];
  }

  if (genres && genres.length > 0) {
    filter.genre = { $in: genres.map(genre => mongoose.Types.ObjectId(genre)) };
  }

  if (moods && moods.length > 0) {
    filter.moods = { $in: moods.map(mood => mongoose.Types.ObjectId(mood)) };
  }

  if (bpm) {
    filter.temp = bpm;
  }

  if (topSellingMusic) {
    sort.salesCount = -1
  }
  if (recentlyAddedMusic) {
    sort.createdAt = -1;
  }

  const songs = await Song.paginate(filter, {
    page,
    limit,
    populate: ['genre', 'creator', 'moods', 'language'],
    customLabels: customLabels,
    sort
  })
  return songs;
}


/**
 * Increment the numberOfPlays counter for a specific song
 * @param {string} songId - Song ID
 * @returns {Promise<object>} - Updated song object
 */
const incrementNumberOfPlays = async (songId) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Song not found');
  }
  song.numberOfPlays += 1;
  await song.save();
  return song;
};



const downloadSong = async (userId, songId) => {
  const user = await User.findById(userId);
  const song = await Song.findById(songId);
  if (!user || !song) {
    throw new Error('User or song not found');
  }
  const isDownloadSongs = await DownloadedSongs.exists({ userId, songId });
  if (!isDownloadSongs) {
    const response = await axios.get(song.uploadUrl, { responseType: 'stream' });

    // Get the default 'Downloads' folder for different operating systems
    const downloadPath = path.join(os.homedir(), 'Downloads', `song_${song.id}.mp3`);

    // Pipe the stream to the file
    const writer = fs.createWriteStream(downloadPath);
    response.data.pipe(writer);
    // Return a promise that resolves when the download is complete
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        await DownloadedSongs.create({ userId, songId });
        // Increment the download counter
        song.numberOfDownloads += 1;
        await song.save();

        resolve(downloadPath);
      });

      writer.on('error', (err) => {
        reject(err);
      });
    });
  } else {
    throw Error("Song already downloaded!")
  }

};

/**
 * Get all liked songs by a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
const getDownloadedSongsByUser = async (userId) => {
  const downloadedSongs = await DownloadedSongs.find({ userId }).populate({
    path: 'songId',
    populate: ['moods', 'genre', 'creator']
  });
  return downloadedSongs.map((downloadedSong) => downloadedSong.songId);
};



const listBestSellingMusic = async (creatorId, page = 1, limit = 10) => {
  const bestSellingMusic = await Song.paginate({
    creator: creatorId
  }, {
    sort: { salesCount: -1 },
    page,
    limit,
    populate: ['genre', 'creator', 'moods', 'language']
  })
  return bestSellingMusic;
};

// CREATOR STATS DASHBOARD SERVICES
const getTotalNumberOfPlays = async (creatorId) => {
  try {
    // Find songs by the creator
    const songs = await Song.find({ creator: creatorId });

    // Calculate total numberOfPlays
    const totalPlays = songs.reduce((sum, song) => sum + song.numberOfPlays, 0);

    return totalPlays;
  } catch (error) {
    throw error;
  }
};

const getTotalNumberOfLikesForSongs = async (creatorId) => {
  try {
    // Find songs by the creator
    const songs = await Song.find({ creator: creatorId });

    // Calculate total numberOfPlays
    const totalLikes = songs.reduce((sum, song) => sum + song.numberOfLikes, 0);

    return totalLikes;
  } catch (error) {
    throw error;
  }
};

const getTotalSalesCountForCreators = async (creatorId) => {
  try {
    // Find songs by the creator
    const songs = await Song.find({ creator: creatorId });

    // Calculate total numberOfPlays
    const totalSales = songs.reduce((sum, song) => sum + song.salesCount, 0);

    return totalSales;
  } catch (error) {
    throw error;
  }
}






module.exports = {
  uploadNewSong,
  getAllSongs,
  getCreatorSongs,
  editSong,
  getSongById,
  getNumberOfLikes,
  getTopSongs,
  getSongDetails,
  searchAndFilterSongs,
  incrementNumberOfPlays,
  downloadSong,
  getDownloadedSongsByUser,
  listBestSellingMusic,
  fetchRandomSong,
  getTotalNumberOfPlays,
  getTotalNumberOfLikesForSongs,
  getTotalSalesCountForCreators
}
