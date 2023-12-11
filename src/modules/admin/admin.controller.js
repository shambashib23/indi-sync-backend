const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const creatorService = require('../creator/creator.service');
const songService = require('../song/song.service');
const cartService = require('../cart/cart.service');
const adminService = require('./admin.service');
const { responseMessage } = require('../../utils/common');
const ApiSuccess = require("../../utils/ApiSuccess");

const promoteMusic = catchAsync(async (req, res) => {
  const { songId } = req.params;
  const admin = req.user;
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
  }
  const updateSong = await adminService.updateMusicByPromotionStatus(req.body, songId);
  return new ApiSuccess(res, httpStatus.OK, "Song updated successfully!", updateSong)
});

const fetchPromotedMusic = catchAsync(async (req, res) => {
  const musics = await adminService.fetchPromotedMusic();
  const admin = req.user;
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
  }
  return new ApiSuccess(res, httpStatus.OK, "Promoted songs fetched successfully!", musics)
})


module.exports = {
  promoteMusic,
  fetchPromotedMusic
}

