const allRoles = {
  user: [
    'getUserProfile',
    'editUserProfile',
    'getCreatorInUser',
    'followCreator',
    'unFollowCreator',
    'followUnfollowCreator',
    'likeUnlikeCreator',
    'likeSong',
    'unlikeSong',
    'buySongs',
    'downloadSongs'
  ],
  creator: [
    'manageSongs',
    'subscribe',
    'connectAccount',
    'createCoupons',
    'bestSellingMusic',
    'managePlaylist'
  ],

  admin: [
    'getUsers',
    'manageUsers',
    'managePricingPlan',
    'updateSongPromotion',
    'getMusicByPromotion',
    'createCouponCode'
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
