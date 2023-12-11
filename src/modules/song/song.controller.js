const httpStatus = require('http-status');
const ApiSuccess = require('../../utils/ApiSuccess');
const catchAsync = require('../../utils/catchAsync');
const songService = require('./song.service');
const { responseMessage } = require('../../utils/common');

const uploadSong = catchAsync(async (req, res) => {
  const song = await songService.uploadNewSong(req.user.id, req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Song uploaded successfully", song);
})

const getAllSongs = catchAsync(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const songs = await songService.getAllSongs(page, limit);
  return new ApiSuccess(res, httpStatus.OK, "Songs fetched successfully", songs);
})

const getCreatorSongs = catchAsync(async (req, res) => {
  const { page = 1, limit = 5, sorting } = req.query;
  const songs = await songService.getCreatorSongs(req.body.creatorId, page, limit, sorting);
  return new ApiSuccess(res, httpStatus.OK, "Creator songs", songs);
})

const editSong = catchAsync(async (req, res) => {
  const editedSong = await songService.editSong(req.body, req.params.songId);
  return new ApiSuccess(res, httpStatus.OK, "Song edited successfully", editedSong)
})

const getNumberOfLikes = catchAsync(async (req, res) => {
  const numberOfLikes = await songService.getNumberOfLikes(req.body.creatorId);
  return new ApiSuccess(res, httpStatus.OK, "Number of likes", numberOfLikes);
})

const getTopSongs = catchAsync(async (req, res) => {
  const { page, limit } = req.query
  const topSongsResult = await songService.getTopSongs(page, limit);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.TOP_SONGS_FETCHED, topSongsResult);
});

const getSongDetails = catchAsync(async (req, res) => {
  const song = await songService.getSongDetails(req.params.songId);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.SONG_DETAILS, song);
})

const filterSongs = catchAsync(async (req, res) => {
  // const { search, genre, mood, bpm } = req.body;
  const songs = await songService.searchAndFilterSongs(req.body, req.query.page, req.query.limit);

  return new ApiSuccess(res, httpStatus.OK, responseMessage.SONG_FILTER, songs);
})

const incrementNumberOfPlays = catchAsync(async (req, res) => {
  const { songId } = req.body;
  const updatedSong = await songService.incrementNumberOfPlays(songId);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.SONG_INCREMENT_SUCCESS, updatedSong);
});

const listBestSellingMusic = catchAsync(async (req, res) => {
  const bestSellingMusic = await songService.listBestSellingMusic(req.user.id, req.query.page, req.query.limit);
  return new ApiSuccess(res, httpStatus.OK, "Best Selling Music", bestSellingMusic);
});

const getRandomSongInHomePage = catchAsync(async (req, res) => {
  const randomMusic = await songService.fetchRandomSong();
  return new ApiSuccess(res, httpStatus.OK, 'Random Song fetched successfullY!', randomMusic);
})


module.exports = {
  uploadSong,
  getAllSongs,
  getCreatorSongs,
  editSong,
  getNumberOfLikes,
  getTopSongs,
  getSongDetails,
  filterSongs,
  incrementNumberOfPlays,
  listBestSellingMusic,
  getRandomSongInHomePage
}
