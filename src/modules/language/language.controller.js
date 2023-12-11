const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const languageService = require('./language.service');
const ApiError = require("../../utils/ApiError");


const addLanguage = catchAsync(async (req, res) => {
  const language = await languageService.addLanguage(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Language added successfully", language)
});

const getAllLanguages = catchAsync(async (req, res) => {
  const languages = await languageService.getAllLanguages();
  return new ApiSuccess(res, httpStatus.OK, "Languages fetched successfully", languages);
})

module.exports = {
  addLanguage,
  getAllLanguages
}
