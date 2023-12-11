const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const Playlist = require("./playlist.model");
const mongoose = require('mongoose')

const createPlaylist = async (creatorId, songs, name) => {
  const newPlaylist = await Playlist.create({
    creator: creatorId,
    name: name,
    songs: songs
  })
  return newPlaylist;
}

const getPlaylistById = async (playlistId) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Playlist does not exist")
  }
  return playlist;
}

const addSongsToPlaylist = async (playlistId, creatorId, songs) => {
  const existingPlaylist = await getPlaylistById(playlistId)
  if (existingPlaylist.creator.toString() !== creatorId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You can only add songs to your own playlist.")
  }
  songs.forEach(songId => {
    const isSongAlreadyInPlaylist = existingPlaylist.songs.some(existingSongId =>
      existingSongId.toString() === songId.toString()
    );
    if (isSongAlreadyInPlaylist) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Song with ID ${songId} is already in the playlist.`);
    }
    existingPlaylist.songs.push(mongoose.Types.ObjectId(songId));
  });
  await existingPlaylist.save();
  return existingPlaylist;
}

const deleteSongsFromPlaylist = async (playlistId, creatorId, songIds) => {
  const existingPlaylist = await getPlaylistById(playlistId);
  if (existingPlaylist.creator.toString() !== creatorId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed to perform this operation.");
  }
  const existingSongIds = existingPlaylist.songs.map(songId => songId.toString());
  const songIdsToDelete = songIds.map(songId => songId.toString());
  // Check if any of the songIds to delete are not present in the existingPlaylist
  const songsNotInPlaylist = songIdsToDelete.filter(songId => !existingSongIds.includes(songId));
  if (songsNotInPlaylist.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Song(s) with ID(s) ${songsNotInPlaylist.join(', ')} not found in the playlist.`);
  }
  // Filter out the songs to be deleted
  existingPlaylist.songs = existingSongIds.filter(existingSongId => !songIdsToDelete.includes(existingSongId));

  await existingPlaylist.save();
  return existingPlaylist;
}

const deletePlaylist = async (playlistId, creatorId) => {
  const existingPlaylist = await getPlaylistById(playlistId);
  if (existingPlaylist.creator.toString() !== creatorId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed to perform this operation.")
  }
  existingPlaylist.remove();
  return;
}

const editPlaylist = async (playlistId, creatorId, updateBody) => {
  const existingPlaylist = await getPlaylistById(playlistId);
  if (existingPlaylist.creator.toString() !== creatorId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not allowed to perform this operation.")
  }
  Object.assign(existingPlaylist, updateBody);
  await existingPlaylist.save();
  return existingPlaylist;
}

const getCreatorPlaylists = async (creatorId) => {
  const playlists = await Playlist.find({ creator: mongoose.Types.ObjectId(creatorId) }).populate('songs');
  return playlists;
}

const getPlaylistDetails = async (playlistId) => {
  const playlist = await Playlist.findById(playlistId).populate('songs');
  return playlist;
}

module.exports = {
  createPlaylist,
  addSongsToPlaylist,
  deleteSongsFromPlaylist,
  deletePlaylist,
  editPlaylist,
  getCreatorPlaylists,
  getPlaylistDetails
}
