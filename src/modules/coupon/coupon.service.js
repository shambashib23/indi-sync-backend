const Coupon = require('./coupon.model');
const generateRandomCouponCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let couponCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters.charAt(randomIndex);
  }

  return couponCode;
};
const createCoupon = async (couponBody, creatorId) => {
  if (!couponBody.code) {
    couponBody.code = generateRandomCouponCode();
    couponBody.creatorId = creatorId;
  }

  if (couponBody.validity) {
    const validity = couponBody.validity;
    const createdAt = new Date();

    if (validity.unit === 'minutes') {
      const validityInMinutes = parseInt(validity.value);
      if (!isNaN(validityInMinutes)) {
        const validTill = new Date(createdAt.getTime() + validityInMinutes * 60000);
        couponBody.validTill = validTill;
      }
    } else if (validity.unit === 'days') {
      const validityInDays = parseInt(validity.value);
      if (!isNaN(validityInDays)) {
        const validTill = new Date(createdAt.getTime() + validityInDays * 24 * 60 * 60 * 1000);
        couponBody.validTill = validTill;
      }
    }
  }

  const coupon = await Coupon.create(couponBody);
  return coupon;
};


const getCoupons = async () => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  const formattedCoupons = coupons.map((coupon) => {
    const remainingTime = calculateRemainingTime(coupon.validTill);
    return {
      ...coupon._doc,
      validTill: remainingTime,
    };
  });
  return formattedCoupons;
};


// Function to calculate remaining time in a human-readable format
const calculateRemainingTime = (validTill) => {
  const now = new Date();
  const diffInMilliseconds = validTill - now;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours`;
  }
};


const getCouponsByCreator = async (creatorId) => {
  const currentDate = new Date();
  const coupons = await Coupon.find({ creatorId, validTill: { $gte: currentDate } })
    .sort({ createdAt: -1 })
    .populate('creatorId');

  // Manipulate the response to include formatted validTill
  const formattedCoupons = coupons.map((coupon) => {
    const remainingTime = calculateRemainingTime(coupon.validTill);
    return {
      ...coupon._doc,
      validTill: remainingTime,
    };
  });

  return formattedCoupons;
}



module.exports = {
  createCoupon,
  getCoupons,
  getCouponsByCreator
}
