const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const { userController } = require('../../modules/user');
const { paymentController } = require('../../modules/payment');
const orderController  = require('../../modules/order/order.controller');

const router = express.Router();

router.route('/profile')
  .get(auth('getUserProfile'), userController.getUserProfile);

router.route('/update-profile')
  .put(auth('editUserProfile'), userController.updateUser);

router.route('/follow-unfollow-creator')
  .post(auth('followUnfollowCreator'), userController.followUnfollowCreatorByUser);

router.route('/like-unlike-creator')
  .post(auth('likeUnlikeCreator'), userController.likeUnlikeCreatorByUser);

// router.route('/unfollow-creator')
//   .post(auth('unFollowCreator'), userController.unFollowCreatorByUser);

router.route('/like-dislike-song')
  .post(auth('likeSong'), userController.likeDislikeSongsByUser);

router.route('/list-liked-songs')
  .get(auth('likeSong'), userController.getLikedSongsByUser);


router.route('/top-artists')
  .get(userController.getTopArtists);

router.route('/songs/add-to-cart')
  .post(auth('likeSong'), userController.addSongByUserInCart);

router.route('/songs/remove-from-cart')
  .delete(auth('likeSong'), userController.deleteSongFromCart);

router.route('/songs/fetch-cart-songs')
  .get(auth('likeSong'), userController.fetchSongsFromCart);


router.route('/download/songs')
  .post(auth('downloadSongs'), userController.downloadSongForUser);

router.route('/downloads')
  .get(auth('downloadSongs'), userController.getDownloadedSongsForUser);

router.route('/orders')
  .get(auth('downloadSongs'), orderController.fetchOrdersForUser);
// router.route('/get-creator')
//   .post(auth('getCreatorInUser'), validate(userValidation.getCreatorProfileById), userController.getCreatorForUser)

// router
//   .route('/')
//   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);
router.route('/add-card-details').post(auth('buySongs'), paymentController.createCard)
router.route('/cart/checkout').get(auth('buySongs'), userController.cartCheckout)
module.exports = router;

