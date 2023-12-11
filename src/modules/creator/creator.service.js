const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const User = require("../user/user.model");
const { songService, Song } = require("../song");

const getCreatorProfileById = async (creatorId) => {
  const creator = await findCreatorById(creatorId);
  return creator;
}

const findCreatorById = async (creatorId) => {
  const creator = await User.findById(creatorId);
  if (!creator) {
    throw new ApiError(httpStatus.NOT_FOUND, "Creator profile not found!");
  }
  return creator;
}

const editCreatorName = async (creatorId, updateBody) => {
  const creator = await findCreatorById(creatorId);
  Object.assign(creator, updateBody);
  await creator.save();
  return creator;
}

const editCreatorGeneral = async (creatorId, updateBody) => {
  const creator = await findCreatorById(creatorId);
  Object.assign(creator, updateBody);
  await creator.save();
  return creator
}

const editCreatorPassword = async (creatorId, updateBody) => {
  const creator = await findCreatorById(creatorId);
  Object.assign(creator, updateBody);
  await creator.save();
  return creator;
}

const getNumberOfFollowers = async (creatorId) => {
  const creator = await findCreatorById(creatorId);
  return creator.numberOfFollowers;
}

const getTotalSongsSoldByCreator = async (creatorId) => {
  const count = await Song.countDocuments({
    creator: creatorId
  })
  return count
}

const getNewComers = async () => {
  const newComers = await User.find({ role: 'creator' }).sort({ 'createdAt': -1 })
  return newComers;
};

// Creator dashboard
const getTotalFollowCount = async (creatorId) => {
  try {
    // Find songs by the creator
    const creator = await findCreatorById(creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    return creator.numberOfFollowers;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getCreatorProfileById,
  editCreatorName,
  editCreatorGeneral,
  editCreatorPassword,
  findCreatorById,
  getNumberOfFollowers,
  getTotalSongsSoldByCreator,
  getNewComers,
  getTotalFollowCount
}
