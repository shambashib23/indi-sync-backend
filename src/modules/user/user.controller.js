// const { getUserById } = require('./user.service');
const userService = require('./_user.service');
const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const creatorService = require('../creator/creator.service');
const songService = require('../song/song.service');
const cartService = require('../cart/cart.service');
const { responseMessage } = require('../../utils/common');
const ApiSuccess = require("../../utils/ApiSuccess");
const User = require('./user.model');
const fs = require('fs');
const path = require('path');

const getUserProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  };
  const user = await userService.getUserById(userId);
  // const user = await User.findById(userId);
  // const user = await getUserById(userId);
  // console.log(await userService.getUserByEmail(user.email));
  return new ApiSuccess(res, httpStatus.OK, responseMessage.USER_PROFILE, user);
});


const updateUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const updatedUser = await userService.updateUserById(userId, req.body);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.USER_PROFILE_UPDATE, updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const followUnfollowCreatorByUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { creatorId } = req.body;
  const followCreator = await userService.followUnfollowCreatorByUser(userId, creatorId);
  return new ApiSuccess(res, httpStatus.OK, followCreator);
});

const likeUnlikeCreatorByUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { creatorId } = req.body;
  const likeCreator = await userService.likeUnlikeCreatorByUser(userId, creatorId);
  return new ApiSuccess(res, httpStatus.OK, likeCreator);
});

// Controller for Liking and disliking a song!
const likeDislikeSongsByUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;
  const verifySong = await songService.getSongById(songId);
  if (!verifySong) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
  }
  const likeSong = await userService.likeDislikeSongsByUser(userId, songId);
  return new ApiSuccess(res, httpStatus.OK, likeSong);
});

const getLikedSongsByUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const likedSongs = await userService.getLikedSongsByUser(userId);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.LIST_OF_LIKED_SONGS_BY_USER, likedSongs);
})

const getTopArtists = catchAsync(async (req, res) => {
  const topArtistResult = await userService.getTopArtists();
  return new ApiSuccess(res, httpStatus.OK, responseMessage.TOP_ARTISTS_FETCHED, topArtistResult);
});


const addSongByUserInCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;
  const addSongToCart = await cartService.addSongByUserInCart(userId, songId, req.body.licenses);
  return new ApiSuccess(res, httpStatus.OK, addSongToCart);
})


const deleteSongFromCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { songId } = req.body;
  const removeSongFromCart = await cartService.deleteSongFromCart(userId, songId, req.body.license);
  return new ApiSuccess(res, httpStatus.OK, removeSongFromCart);
});

const fetchSongsFromCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const fetchSongsFromCart = await cartService.fetchSongsFromCart(userId);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.ALL_SONGS_FROM_CART, fetchSongsFromCart);
});

const cartCheckout = catchAsync(async (req, res) => {
  const checkout = await cartService.cartCheckout(req.user.id)
  return new ApiSuccess(res, httpStatus.OK, "Checkout", checkout);
});



const downloadSongForUser = catchAsync(async (req, res) => {
  const user = req.user;
  const validUser = await userService.getUserById(user.id);
  if (!validUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  };
  const songId = req.body.songId;
  const validSong = await songService.getSongById(songId);
  if (!validSong) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Song not found!');
  };

  // Provide the path where you want to save the downloaded song
  const downloadFolderPath = path.join(__dirname, '..', 'Downloads');
  try {
    // Call the service function to download the song
    const downloadedFilePath = await songService.downloadSong(validUser.id, validSong.id);

    // Include the download link or path in the success response
    return new ApiSuccess(res, httpStatus.OK, 'Song downloaded successfully', downloadedFilePath);
  } catch (error) {
    // Handle any errors that might occur during the download
    throw new ApiError(httpStatus.CONFLICT, error);
  }
});

const getDownloadedSongsForUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const downloadedSongs = await songService.getDownloadedSongsByUser(userId);
  return new ApiSuccess(res, httpStatus.OK, 'List of downloaded songs for this user!', downloadedSongs);

})






module.exports = {
  updateUser,
  deleteUser,
  getUserProfile,
  followUnfollowCreatorByUser,
  likeDislikeSongsByUser,
  getTopArtists,
  getTopArtists,
  likeUnlikeCreatorByUser,
  getLikedSongsByUser,
  addSongByUserInCart,
  deleteSongFromCart,
  fetchSongsFromCart,
  cartCheckout,
  downloadSongForUser,
  getDownloadedSongsForUser
};
