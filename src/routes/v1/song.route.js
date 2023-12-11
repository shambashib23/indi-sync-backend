const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const { songController } = require('../../modules/song')

const router = express.Router();

router.route('/all').get(songController.getAllSongs)
router.route('/creator-songs').post(songController.getCreatorSongs)
router.route('/top-songs').get(songController.getTopSongs);
router.route('/details/:songId').get(songController.getSongDetails)
router.route('/filter').post(songController.filterSongs) // send by req query params
router.route('/increase-play-count').post(songController.incrementNumberOfPlays);
router.route('/random-music').get(songController.getRandomSongInHomePage);
module.exports = router;
