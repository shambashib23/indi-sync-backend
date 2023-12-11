const httpStatus = require('http-status');
const User = require('./user.model');
const { Follow } = require('../follows');
const { LikedSongs } = require('../likedSongs');
const { DownloadedSongs } = require('../songDownloads');
const { LikedCreators } = require('../likedCreators');
const { Song, songService } = require('../song');
const ApiError = require('../../utils/ApiError');
const { paymentService } = require('../payment');


/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return await paymentService.createCustomer(user.email);
  // return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw error
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Follow creator by id
 * @body {ObjectId} creatorId
 * @returns {Promise<User>}
 */

/**
 * Follow or unfollow a creator based on user input
 * @param {string} userId - User ID
 * @param {string} creatorId - Creator ID to follow/unfollow
 * @returns {Promise<void>}
 */
const followUnfollowCreatorByUser = async (userId, creatorId) => {
  // Get the user and creator from the database
  const user = await getUserById(userId);
  const creator = await User.findById(creatorId);

  // Check if the user and creator exist
  if (!user || !creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or creator not found');
  }
  // Check if the user is already following the creator
  const isFollowing = await Follow.exists({ userId, creatorId });
  if (!isFollowing) {
    // Update the user's numberOfFollowers
    creator.numberOfFollowers += 1;

    // Create a follow relationship
    await Follow.create({ userId, creatorId });
    await creator.save();
    return "Followed the creator successfully"
  } else {
    // unfollow
    creator.numberOfFollowers -= 1;

    // Remove the follow relationship
    await Follow.deleteOne({ userId, creatorId });

    await creator.save();
    return "Unfollowed successfully"
    // throw new ApiError(httpStatus.BAD_REQUEST, 'User is already following the creator');
  }
};

/**
 * Like or Unlike a creator based on user input
 * @param {string} userId - User ID
 * @param {string} creatorId - Creator ID to like/unlike
 * @returns {Promise<void>}
 */
const likeUnlikeCreatorByUser = async (userId, creatorId) => {
  // Get the user and creator from the database
  const user = await getUserById(userId);
  const creator = await User.findById(creatorId);

  // Check if the user and creator exist
  if (!user || !creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or creator not found');
  }
  // Check if the user is already following the creator
  const isLiking = await LikedCreators.exists({ userId, creatorId });
  if (!isLiking) {
    // Update the creator's likes
    creator.numberOfLikes += 1;
    // Create a follow relationship
    await LikedCreators.create({ userId, creatorId });
    await creator.save();
    return "Liked the creator successfully"
  } else {
    // unfollow
    creator.numberOfLikes -= 1;
    // Remove the follow relationship
    await LikedCreators.deleteOne({ userId, creatorId });
    await creator.save();
    return "Unliked the creator successfully"
  }
};





const likeDislikeSongsByUser = async (userId, songId) => {
  const user = await getUserById(userId);
  // const song = await Song.findById(songId);
  const song = await songService.getSongById(songId)
  // Check if the user and creator exist
  if (!user || !song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or song not found');
  };
  // Check if the user is already following the creator
  const isLikingSongs = await LikedSongs.exists({ userId, songId });
  if (!isLikingSongs) {
    // Update the user's numberOfFollowers
    song.numberOfLikes += 1;
    // Create a follow relationship
    await LikedSongs.create({ userId, songId });
    await song.save();
    return "Song has been liked by user"
  } else {
    song.numberOfLikes -= 1;

    // Remove the follow relationship
    await LikedSongs.deleteOne({ userId, songId });

    await song.save();
    return "Disliked song successfully"
  };

}

/**
 * Get all liked songs by a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
const getLikedSongsByUser = async (userId) => {
  const likedSongs = await LikedSongs.find({ userId }).populate('songId').populate({
    path: 'songId',
    populate: ['moods', 'genre', 'creator']
  });
  return likedSongs.map((likedSong) => likedSong.songId);
};



const getTopArtists = async () => {
  const maxFollowedArtists = await User.findOne({}, { numberOfFollowers: 1 }).sort({ numberOfFollowers: -1 });
  if (!maxFollowedArtists) {
    return []; // No songs found
  }
  const topArtists = await User.find({ numberOfFollowers: maxFollowedArtists.numberOfFollowers })
    .limit(10);
  return topArtists;
}

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  followUnfollowCreatorByUser,
  likeDislikeSongsByUser,
  getTopArtists,
  getLikedSongsByUser,
  getTopArtists,
  likeUnlikeCreatorByUser
};
