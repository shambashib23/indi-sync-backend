const httpStatus = require("http-status");
const { pricingPlanService } = require("../modules/pricingPlan");
const ApiError = require("../utils/ApiError");

const subscription = async (req, res, next) => {
  try {
    console.log(req.user)
    if (req.user.subscriptionId === "" || !req.user.currentPlan) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "You are not subscribed to any plan"))
    }
    const plan = await pricingPlanService.getPricingPlanById(req.user.currentPlan);
    if (req.user.numberOfSongsMade > plan.uploadLimit && plan.uploadLimit !== -1) {
      return next(new ApiError(httpStatus.FORBIDDEN, "You need to upgrade your subscription plan"));
    }
    return next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = subscription;