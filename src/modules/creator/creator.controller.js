const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const creatorService = require('./creator.service');
const couponService = require('../coupon/coupon.service');
const songService = require('../song/song.service');
const pricingPlanService = require('../pricingPlan/pricingPlan.service');
const ApiError = require("../../utils/ApiError");


const getCreatorProfile = catchAsync(async (req, res) => {
  const creatorId = req.user.id;
  const creator = await creatorService.getCreatorProfileById(creatorId);
  if (!creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Creator not found!');
  }
  return new ApiSuccess(res, httpStatus.OK, "Creator Profile fetched successfully", creator);
});

const editCreatorName = catchAsync(async (req, res) => {
  const creator = await creatorService.editCreatorName(req.user._id, req.body);
  return new ApiSuccess(res, httpStatus.OK, "Name updated successfully", creator);
})

const editCreatorGeneral = catchAsync(async (req, res) => {
  const creator = await creatorService.editCreatorGeneral(req.user._id, req.body);
  return new ApiSuccess(res, httpStatus.OK, "General details updated successfully", creator);
})

const editCreatorPassword = catchAsync(async (req, res) => {
  const creator = await creatorService.editCreatorPassword(req.user._id, req.body)
  return new ApiSuccess(res, httpStatus.OK, "Password updated successfully", creator)
})

const getNumberOfFollowers = catchAsync(async (req, res) => {
  const numberOfFollowers = await creatorService.getNumberOfFollowers(req.body.creatorId)
  return new ApiSuccess(res, httpStatus.OK, "Number of followers", numberOfFollowers)
})

const getTotalSongsSoldByCreator = catchAsync(async (req, res) => {
  const totalNumberOfSongs = await creatorService.getTotalSongsSoldByCreator(req.body.creatorId);
  return new ApiSuccess(res, httpStatus.OK, "Number of songs", totalNumberOfSongs)
});


const createCouponByCreator = catchAsync(async (req, res) => {
  const creatorId = req.user.id;
  const createCoupon = await couponService.createCoupon(req.body, creatorId);
  if (!createCoupon) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon could not be created!');
  };
  if (!creatorId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Creator could not be found!');
  };
  return new ApiSuccess(res, httpStatus.OK, "Coupon created successfully in Creator", createCoupon);
});


const getCouponsByCreator = catchAsync(async (req, res) => {
  const creatorId = req.user.id;
  if (!creatorId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Creator could not be found!');
  };
  const getCoupon = await couponService.getCouponsByCreator(creatorId);
  const noOfCoupons = getCoupon.length;
  return new ApiSuccess(res, httpStatus.OK, `${noOfCoupons} Coupons fetched successfully in Creator`, getCoupon);
});

const getNewComers = catchAsync(async (req, res) => {
  const newComers = await creatorService.getNewComers();
  return new ApiSuccess(res, httpStatus.OK, "New comers", newComers);
});

const getCreatorStats = catchAsync(async (req, res) => {
  const creatorId = req.user.id;
  const numberOfPlays = await songService.getTotalNumberOfPlays(creatorId);
  const numberOfLikes = await songService.getTotalNumberOfLikesForSongs(creatorId);
  const numberOfSalesCount = await songService.getTotalSalesCountForCreators(creatorId);
  const numberOfFollowers = await creatorService.getTotalFollowCount(creatorId);
  const data = {
    totalNumberOfPlays: numberOfPlays,
    totalNumberOfLikes: numberOfLikes,
    totalSalesForSongs: numberOfSalesCount,
    totalFollowers: numberOfFollowers
  }
  return new ApiSuccess(res, httpStatus.OK, 'Data fetched successfully!', data);

});


const getPricingPlanPurchasedByCreator = catchAsync(async(req, res) => {
  const creatorId = req.user.id;
  const planByCreator = await pricingPlanService.getPricingPlanByCreatorId(creatorId);

  return new ApiSuccess(res, httpStatus.OK, "Creator's purchased plan fetched successfully!", planByCreator);
})






module.exports = {
  getCreatorProfile,
  editCreatorName,
  editCreatorGeneral,
  editCreatorPassword,
  getNumberOfFollowers,
  getTotalSongsSoldByCreator,
  createCouponByCreator,
  getCouponsByCreator,
  getNewComers,
  getCreatorStats,
  getPricingPlanPurchasedByCreator
}
