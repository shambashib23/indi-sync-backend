const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const newsLetterService = require("./newsletter.service");
const { responseMessage } = require("../../utils/common");


const createSubscription = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await newsLetterService.createSubscription(email);
  return new ApiSuccess(res, httpStatus.CREATED, "Newsletter subscription successfully", result)
});

const fetchNewsLetterSubscriptions = catchAsync(async (req, res) => {
  const result = await newsLetterService.fetchNewsLetterSubscriptions();
  return new ApiSuccess(res, httpStatus.OK, responseMessage.NEWSLETTERS_SUCCESS, result)
});

const deleteNewslettersByIds = catchAsync(async (req, res) => {
  const { newsletterIds } = req.body;

  // Call the service to delete newsletter subscriptions
  const result = await newsLetterService.deleteNewslettersByIds(newsletterIds);

  return new ApiSuccess(res, httpStatus.OK, responseMessage.NEWSLETTER_DELETED_SUCCESSFULLY, result);
});







module.exports = {
  createSubscription,
  fetchNewsLetterSubscriptions,
  deleteNewslettersByIds
}

