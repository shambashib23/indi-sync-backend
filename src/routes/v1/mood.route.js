const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { moodController, moodValidation } = require('../../modules/mood')

const router = express.Router();

router.route('/add').post(auth('manageUsers'), validate(moodValidation.addMood), moodController.addMood)
router.route('/all').get(moodController.getAllMoods)
router.route('/top-moods').get(moodController.getTopMoods)

module.exports = router;
