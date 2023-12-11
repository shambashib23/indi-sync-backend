const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const genreService = require('./genre.service');
const ApiError = require("../../utils/ApiError");


const addGenre = catchAsync(async (req, res) => {
  const genre = await genreService.addGenre(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Genre added successfully", genre)
});

const getAllGenre = catchAsync(async (req, res) => {
  const genre = await genreService.getAllGenre();
  return new ApiSuccess(res, httpStatus.OK, "Genre fetched successfully", genre);
})

module.exports = {
  addGenre,
  getAllGenre
}
