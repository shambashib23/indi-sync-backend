const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { creatorController, creatorValidation } = require('../../modules/creator')
const { songController, songValidation } = require('../../modules/song');
const { paymentController } = require('../../modules/payment');
const subscription = require('../../middlewares/subscription');
const { playlistController } = require('../../modules/playlist');
// const { orderController } = require('../../modules/order');
const router = express.Router();

router.route('/profile').get(auth('manageSongs'), creatorController.getCreatorProfile)
router.route('/profile/edit/name').patch(auth('manageSongs'), validate(creatorValidation.editCreatorName), creatorController.editCreatorName)
router.route('/profile/edit/general').patch(auth('manageSongs'), validate(creatorValidation.editCreatorGeneral), creatorController.editCreatorGeneral)
router.route('/profile/edit/password').patch(auth('manageSongs'), validate(creatorValidation.editCreatorPassword), creatorController.editCreatorPassword)
router.route('/song/upload-new').post(auth('manageSongs'), subscription, songController.uploadSong)
router.route('/song/edit/:songId').patch(auth('manageSongs'), songController.editSong)

// Dashboard APIs
router.route('/total-song-likes').post(songController.getNumberOfLikes)
router.route('/total-follows').post(creatorController.getNumberOfFollowers)
router.route('/add-card-details').post(auth('subscribe'), paymentController.createCard)
// router.route('/total-songs-sold').post(creatorController.getTotalSongsSoldByCreator)
router.route('/newcomers').get(creatorController.getNewComers)
router.route('/playlist/create').post(auth('managePlaylist'), playlistController.createPlaylist)
router.route('/playlist/edit/:playlistId').patch(auth('managePlaylist'), playlistController.editPlaylist)
router.route('/playlist/add-songs/:playlistId').post(auth('managePlaylist'), playlistController.addSongsToPlaylist)
router.route('/playlist/delete-songs/:playlistId').delete(auth('managePlaylist'), playlistController.deleteSongsFromPlaylist)
router.route('/playlist/delete/:playlistId').delete(auth('managePlaylist'), playlistController.deletePlaylist)
router.route('/playlist/my-playlist').post(playlistController.getCreatorPlaylists)
router.route('/playlist/:playlistId').get(playlistController.getPlaylistDetails)


router.route('/create-coupon').post(auth('manageSongs'), creatorController.createCouponByCreator);
router.route('/get-coupons').get(auth('manageSongs'), creatorController.getCouponsByCreator);

// Payment APIs
router.route('/connect-account/create').get(auth('connectAccount'), paymentController.createConnectAccount);
router.route('/connect-account/create/success').get((req, res) => {
  return res.json({
    message: "success"
  })
})
router.route('/connect-account/create/failed').get((req, res) => {
  return res.json({
    message: 'failed'
  })
})

// earnings APIs
router.route('/best-selling-songs').get(auth('bestSellingMusic'), songController.listBestSellingMusic)

// creator dashboard apis
router.route('/dashboard/creator/stats').get(auth('bestSellingMusic'), creatorController.getCreatorStats);
router.route('/purchased/plans').get(auth('bestSellingMusic'), creatorController.getPricingPlanPurchasedByCreator);
module.exports = router;
