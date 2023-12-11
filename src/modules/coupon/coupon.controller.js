const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const couponService = require("../../modules/coupon/coupon.service");
const ApiError = require("../../utils/ApiError");

const createCoupon = catchAsync (async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Coupon created successfully", coupon)
});

const getAllCoupons = catchAsync(async (req, res) => {
  const genre = await couponService.getCoupons();
  return new ApiSuccess(res, httpStatus.OK, "Coupons fetched successfully", genre);
})




module.exports = {
  createCoupon,
  getAllCoupons
}
