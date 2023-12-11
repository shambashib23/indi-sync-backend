const express = require('express');

const validate = require('../../middlewares/validate');
const { contactController, contactValidation } = require('../../modules/contactUs');

const router = express.Router();

router.route('/add')
  .post(validate(contactValidation.addContactUsMessage), contactController.createContactUs);
router.route('/all')
  .get(contactController.getAllContacts);

module.exports = router;

