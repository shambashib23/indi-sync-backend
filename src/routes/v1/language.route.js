const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { languageController, languageValidation } = require('../../modules/language')
// const { moodController, moodValidation } = require('../../modules/mood')
// const { pricingPlanController } = require('../../modules/pricingPlan')

const router = express.Router();

router.route('/add').post(auth('manageUsers'), validate(languageValidation.addLanguage), languageController.addLanguage)
router.route('/all').get(languageController.getAllLanguages)

module.exports = router;
