const httpStatus = require('http-status');
const User = require('../user/user.model');
const { Song, songService } = require('../song');
const ApiError = require('../../utils/ApiError');
// const { getUserById } = require('../user/user.service');
// const { userService } = require('../user')
const { userService } = require('../user')
const Cart = require('./cart.model');
const { orderService, Order } = require('../order');
const { Transaction } = require('../transaction');
const { cartService } = require('.');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



/**
 * Like or Unlike a creator based on user input
 * @param {string} userId - User ID
 * @param {string} songId - Song ID to add to cart / remove song from cart
 * @returns {Promise<void>}
 */
async function getLicenseInfo(songId, licenseType) {
  const song = await Song.findById(songId);

  if (!song) {
    console.error('Song not found for ID:', songId);
    return null;
  }

  // Extract information for each pricing plan
  const licenseInfoArray = [
    {
      licenseType: 'basicPlan',
      price: song.basicPlan.price,
      _id: song.basicPlan._id
      // isChecked: song.basicPlan.isChecked
    },
    {
      licenseType: 'premiumPlan',
      price: song.premiumPlan.price,
      _id: song.premiumPlan._id
      // isChecked: song.premiumPlan.isChecked
    },
    {
      licenseType: 'unlimitedPlan',
      price: song.unlimitedPlan.price,
      _id: song.unlimitedPlan._id
      // isChecked: song.unlimitedPlan.isChecked
    },
    {
      licenseType: 'exclusivePlan',
      price: song.exclusivePlan.price,
      _id: song.exclusivePlan._id
      // isChecked: song.exclusivePlan.isChecked
    }
  ];
  for (let license of licenseInfoArray) {
    if (license.licenseType === licenseType) {
      return license;
    }
  }
  // return licenseInfoArray;
}

const addSongByUserInCart = async (userId, songId, licenses) => {
  const user = await userService.getUserById(userId);
  // const song = await Song.findById(songId);
  const song = await songService.getSongById(songId);
  const licenseObjects = [];

  if (!user || !song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or song not found');
  };
  let existingLicensess = "";
  let hasExistingLicense = false;
  for (let license of licenses) {
    const cartEntry = await Cart.findOne({
      $and: [
        { userId: userId },
        { songId: songId },
        { 'license.licenseType': { $eq: license } }
      ]
    })
    if (!cartEntry) {
      const licenseObj = await getLicenseInfo(songId, license);
      await Cart.create({ userId, songId, license: licenseObj });
    } else {
      existingLicensess += license + " ";
      hasExistingLicense = true;
    }
  }
  if (hasExistingLicense) {
    throw new ApiError(httpStatus.CONFLICT, `${existingLicensess} already exists in your cart!`)
  }
  return "Song added to the cart";
};

/**
 * Delete a song from the user's cart
 * @param {string} userId - User ID
 * @param {string} songId - Song ID to remove from the cart
 * @returns {Promise<string>} - Success message
 */
const deleteSongFromCart = async (userId, songId, license) => {
  const user = await userService.getUserById(userId);
  const song = await Song.findById(songId);
  if (!user || !song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or song not found');
  }
  const cartEntry = await Cart.findOne({
    $and: [
      { userId: userId },
      { songId: songId },
      { 'license.licenseType': { $eq: license } }
    ]
  });
  if (cartEntry) {
    await cartEntry.remove();
    return 'Song successfully removed from the cart';
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Song not found in cart');
  }
};

/**
 * Fetch all songs from the user's cart
 * @param {string} userId - User ID

 * @returns {Promise<string>} - Success message
 */
const fetchSongsFromCart = async (userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or song not found');
  }
  const songsInCart = await Cart.find({ userId }).populate('songId').populate({
    path: 'songId',
    populate: ['moods', 'genre', 'creator']
  });
  if (songsInCart) {
    return songsInCart;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No Songs found in cart');
  }
};

const cartCheckout = async (userId) => {
  const userCart = await fetchSongsFromCart(userId);
  if (userCart.length <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No items in cart");
  }
  let totalPrice = 0;
  let songsInCart = [];
  const user = await userService.getUserById(userId)
  for (let item of userCart) {
    totalPrice += item.license.price;
    songsInCart.push({
      songId: item.songId._id,
      license: item.license
    });
  }
  const cards = await stripe.customers.listSources(
    user.customerId,
    { object: 'card' }
  )
  let paymentIntent = await stripe.paymentIntents.create({
    customer: user.customerId,
    amount: totalPrice * 100,
    currency: 'usd',
    transfer_group: 'ORDER10',
    payment_method: cards.data[0].id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never'
    },
  });
  console.log(paymentIntent)
  if (paymentIntent.status === 'requires_confirmation') {
    // Attach a payment method to the PaymentIntent
    await stripe.paymentIntents.confirm(paymentIntent.id);

    console.log(paymentIntent)
    // userCart = await fetchSongsFromCart(userId)
    for (let item of userCart) {
      console.log(item);
      const transferForCreator = await stripe.transfers.create({
        amount: item.license.price * 100,
        currency: 'usd',
        destination: item.songId.creator.accountId,
        transfer_group: 'ORDER10',
        metadata: {
          user_id: userId
        }
      })
    }

    let songsInCart = [];
    let totalPrice = 0;

    console.log(userCart)
    for (let item of userCart) {
      totalPrice += item.license.price;
      songsInCart.push({
        songId: item.songId._id,
        license: item.license
      });
    }
    const uniqueSongIds = [...new Set(songsInCart.map(obj => obj.songId))];
    for (let uniqueSongId of uniqueSongIds) {
      const song = await Song.findById(uniqueSongId);
      song.salesCount += 1;
      await song.save();
    }
    // clear out cart
    await Cart.deleteMany({ userId: userId });
    await Order.create({
      userId,
      paymentIntentId: paymentIntent.id,
      items: songsInCart,
      totalPrice: totalPrice
    })
    return paymentIntent;

  }
  // const order = await Order.create({
  //   userId,
  //   paymentIntentId: paymentIntent.id,
  //   items: songsInCart,
  //   totalPrice: totalPrice
  // })
  // console.log("----------")
  // console.log(order);
  // console.log(paymentIntent)
  // console.log("----------------")
  // if (paymentIntent.status === "requires_action" || paymentIntent.status === "requires_confirmation") {
  //   paymentIntent = await stripe.paymentIntents.confirm(
  //     paymentIntent.id,
  //   )

  // console.log(paymentIntent);
  //   for (let item of userCart) {
  //     console.log(item);
  //     const paymentIntentForCreator = await stripe.transfers.create({
  //       amount: item.license.price * 100,
  //       currency: 'usd',
  //       destination: item.songId.creator.accountId,
  //       transfer_group: 'ORDER10',
  //     })
  //     // console.log(paymentIntentForCreator);
  //   }

  //   // add to order collection
  //   const order = await Order.create({
  //     userId,
  //     paymentIntentId: paymentIntent.id,
  //     items: songsInCart,
  //     totalPrice: totalPrice
  //   })
  //   // add to transactions model
  //   let status;
  //   if (paymentIntent.status === "succeeded") {
  //     status = "paid"
  //   }
  //   if (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "cancelled") {
  //     status = "failed"
  //   }
  //   await Transaction.create({
  //     paymentIntentId: paymentIntent.id,
  //     user: userId,
  //     status,
  //     orderId: order.id.toString().slice(4),
  //     amount: order.totalPrice
  //   })

  //   // increase songs sale count
  //   const uniqueSongIds = [...new Set(songsInCart.map(obj => obj.songId))];
  //   for (let uniqueSongId of uniqueSongIds) {
  //     const song = await Song.findById(uniqueSongId);
  //     song.salesCount += 1;
  //     await song.save();
  //   }
  //   // clear out cart
  //   await Cart.deleteMany({ userId });
  //   return paymentIntent;
  // } else {
  //   await stripe.paymentIntents.cancel(
  //     paymentIntent.id
  //   );
  //   return;
  // }
  // const order = await orderService.createOrder(userId, )
}

// const clearCart = async (userId) => {

// }




module.exports = {
  addSongByUserInCart,
  deleteSongFromCart,
  fetchSongsFromCart,
  cartCheckout
}

