const pricingPlanService = require("./pricingPlan.service");
const catchAsync = require("../../utils/catchAsync");
const ApiSuccess = require("../../utils/ApiSuccess");
const httpStatus = require("http-status");
const { responseMessage } = require("../../utils/common");

const addPricingPlan = catchAsync(async (req, res) => {
  const pricingPlan = await pricingPlanService.addPricingPlan(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, "Pricing plan added successfully", pricingPlan)
})

const editPricingPlan = catchAsync(async (req, res) => {
  const editedPricingPlan = await pricingPlanService.editPricingPlan(req.params.planId, req.body);
  return new ApiSuccess(res, httpStatus.OK, "Pricing plan edited successfully", editedPricingPlan);
})

const getAllPricingPlans = catchAsync(async (req, res) => {
  const pricingPlans = await pricingPlanService.getAllPricingPlans();
  return new ApiSuccess(res, httpStatus.OK, "Pricing plans fetched successfully", pricingPlans)
})

const subscribeToPlan = catchAsync(async (req, res) => {
  const subscribedPlan = await pricingPlanService.subscribeToPlan(req.params.planId, req.user);
  return new ApiSuccess(res, httpStatus.OK, responseMessage.PLAN_SUBSCRIBED, subscribedPlan)
})

const editSubscription = catchAsync(async (req, res) => {
  const newSubscription = await pricingPlanService.editSubscription(req.params.planId, req.user);
  return new ApiSuccess(res, httpStatus.OK, "Subscription Plan changed successfully", newSubscription);
})

const cancelSubscription = catchAsync(async (req, res) => {
  const cancelledSubscription = await pricingPlanService.cancelSubscription(req.user);
  return new ApiSuccess(res, httpStatus.OK, "Subscription cancelled successfully", cancelledSubscription);
})

module.exports = {
  addPricingPlan,
  getAllPricingPlans,
  subscribeToPlan,
  editSubscription,
  cancelSubscription,
  editPricingPlan
}