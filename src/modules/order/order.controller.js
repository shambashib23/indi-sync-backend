const httpStatus = require("http-status");
const orderService = require("./order.service");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");


const fetchOrdersForUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userOrders = await orderService.fetchOrders(userId);
  return new ApiSuccess(res, httpStatus.OK, 'Orders fetched successfully for users', userOrders);
});



module.exports = {
  fetchOrdersForUser
}
