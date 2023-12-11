const httpStatus = require("http-status");
const paymentService = require("./payment.service");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");

// payment controller
const createCard = catchAsync(async (req, res) => {
  const createdCard = await paymentService.createCard(req.user, req.body)
  return new ApiSuccess(res, httpStatus.CREATED, "Card added successfully", createdCard)
})

const createConnectAccount = catchAsync(async (req, res) => {
  const link = await paymentService.generateConnectAccountLink(req.user.id);
  return new ApiSuccess(res, httpStatus.CREATED, "Connect Account Link", link);
})

module.exports = {
  createCard,
  createConnectAccount
}