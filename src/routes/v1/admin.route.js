const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../modules/admin/admin.controller');
const newsLetterController = require('../../modules/newsletters/newsletter.controller');
const couponController  = require('../../modules/coupon/coupon.controller');
const couponValidation = require('../../modules/coupon/coupon.validation');
const transactionController = require('../../modules/transaction/transaction.controller');


const router = express.Router();


router.route('/update-song-status/:songId')
  .post(auth('updateSongPromotion'), adminController.promoteMusic);

router.route('/get-promoted-music')
  .get(auth('getMusicByPromotion'), adminController.fetchPromotedMusic);

router.route('/fetch-newsletter-subscriptions')
  .get(auth('getMusicByPromotion'), newsLetterController.fetchNewsLetterSubscriptions);

router.route('/delete-subscriptions')
  .delete(auth('getMusicByPromotion'), newsLetterController.deleteNewslettersByIds);

router.route('/coupon/create')
  .post(auth('createCouponCode'), validate(couponValidation.createCoupon), couponController.createCoupon);

router.route('/coupon/all')
  .get(auth('createCouponCode'), couponController.getAllCoupons)

router.route('/transactions/all')
  .get(auth('createCouponCode'), transactionController.fetchAllTransactions);
module.exports = router;
