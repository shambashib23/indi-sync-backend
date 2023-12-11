const express = require('express');
const validate = require('../../middlewares/validate');
const { newsLetterController } = require('../../modules/newsletters');

const router = express.Router();

router.route('/create-subscription').post(newsLetterController.createSubscription);

module.exports = router;
