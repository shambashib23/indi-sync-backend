const httpStatus = require("http-status");
const playlistService = require("./playlist.service");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");

const createPlaylist = catchAsync(async (req, res) => {
  const { songs, name } = req.body
  const creatorId = req.user.id;
  const playlist = await playlistService.createPlaylist(creatorId, songs, name)
  return new ApiSuccess(res, httpStatus.CREATED, "Playlist created successfully", playlist);
})

const addSongsToPlaylist = catchAsync(async (req, res) => {
  const { songs } = req.body;
  const newPlaylist = await playlistService.addSongsToPlaylist(req.params.playlistId, req.user.id, songs);
  return new ApiSuccess(res, httpStatus.OK, "Songs added to playlist", newPlaylist);
})

const deleteSongsFromPlaylist = catchAsync(async (req, res) => {
  const playlist = await playlistService.deleteSongsFromPlaylist(req.params.playlistId, req.user.id, req.body.songs);
  return new ApiSuccess(res, httpStatus.OK, "Songs deleted from playlist", playlist);
})

const deletePlaylist = catchAsync(async (req, res) => {
  await playlistService.deletePlaylist(req.params.playlistId, req.user.id)
  return new ApiSuccess(res, httpStatus.OK, "Playlist deleted successfully");
})

const editPlaylist = catchAsync(async (req, res) => {
  const newPlaylist = await playlistService.editPlaylist(req.params.playlistId, req.user.id, req.body);
  return new ApiSuccess(res, httpStatus.OK, "Playlist edited successfully", newPlaylist);
})

const getCreatorPlaylists = catchAsync(async (req, res) => {
  const playlists = await playlistService.getCreatorPlaylists(req.body.creatorId);
  return new ApiSuccess(res, httpStatus.OK, "Creator playlists", playlists);
})

const getPlaylistDetails = catchAsync(async (req, res) => {
  const playlist = await playlistService.getPlaylistDetails(req.params.playlistId);
  return new ApiSuccess(res, httpStatus.OK, "Playlist details", playlist)
})

module.exports = {
  createPlaylist,
  addSongsToPlaylist,
  deleteSongsFromPlaylist,
  deletePlaylist,
  editPlaylist,
  getCreatorPlaylists,
  getPlaylistDetails
}
