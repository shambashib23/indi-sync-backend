const User = require('../user/user.model');
const Song = require('../song/song.model');
const songService = require('../song/song.service');
const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
// const Order = require('../order/order.model');









const updateMusicByPromotionStatus = async (updateBody, songId) => {
  const song = await songService.getSongById(songId);
  if (!song) {
    throw new ApiError(httpStatus.NOT_FOUND, "Song does not exist");
  }
  Object.assign(song, updateBody);
  await song.save();
  return song;
};


const fetchPromotedMusic = async () => {
  const songs = await Song.find({
    isPromoted: true
  });
  return songs;
}


module.exports = {
  updateMusicByPromotionStatus,
  fetchPromotedMusic
}

