const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { genreController, genreValidation } = require('../../modules/genre')

const router = express.Router();

router.route('/add').post(auth('manageUsers'), validate(genreValidation.addGenre), genreController.addGenre)
router.route('/all').get(genreController.getAllGenre)
// router.route('/mood/add').post(auth('manageUsers'), validate(moodValidation.addMood), moodController.addMood)
// router.route('/pricing-plan/add').post(auth('managePricingPlan'), pricingPlanController.addPricingPlan)

module.exports = router;
