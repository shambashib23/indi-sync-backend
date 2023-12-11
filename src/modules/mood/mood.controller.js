const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const moodService = require('./mood.service');
const ApiError = require("../../utils/ApiError");


const addMood = catchAsync(async (req, res) => {
  const mood = await moodService.addMood(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Mood added successfully", mood)
});

const getAllMoods = catchAsync(async (req, res) => {
  const moods = await moodService.getAllMoods();
  return new ApiSuccess(res, httpStatus.OK, "Moods fetched successfully", moods);
})

const getTopMoods = catchAsync(async (req, res) => {
  const moods = await moodService.getTopMoods();
  return new ApiSuccess(res, httpStatus.OK, "Top moods", moods);
})

module.exports = {
  addMood,
  getAllMoods,
  getTopMoods
}
