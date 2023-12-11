const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { pricingPlanController } = require('../../modules/pricingPlan')

const router = express.Router();

router.route('/add').post(auth('manageUsers'), pricingPlanController.addPricingPlan)
router.route('/edit/:planId').patch(auth('manageUsers'), pricingPlanController.editPricingPlan)
router.route('/all').get(pricingPlanController.getAllPricingPlans)
router.route('/subscribe/:planId').get(auth('subscribe'), pricingPlanController.subscribeToPlan)
router.route('/subscription/edit/:planId').get(auth('subscribe'), pricingPlanController.editSubscription)
router.route('/subscription/cancel').get(auth('subscribe'), pricingPlanController.cancelSubscription)

module.exports = router;
