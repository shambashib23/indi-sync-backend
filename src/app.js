const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
// const { Order } = require('./modules/order');
// const { userService } = require('./modules/user');
// const { cartService, Cart } = require('./modules/cart')
// const { Song } = require('./modules/song');
// const { paymentService } = require('./modules/payment');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cron = require('node-cron');

const { Coupon } = require('./modules/coupon');

const app = express();
const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}


cron.schedule('0 0 * * *', async () => {
  try {
    // Find and delete expired coupons
    const currentDate = new Date();
    await Coupon.deleteMany({ validTill: { $lt: currentDate } });

    console.log('Expired coupons deleted successfully');
  } catch (error) {
    console.error('Error deleting expired coupons:', error.message);
  }
});
// set security HTTP headers
app.use(helmet());
// app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const payload = req.body;
//   const sig = req.headers['stripe-signature'];
//   let endpointSecret = "whsec_a74da2b3b263ce7c8f5674096033a0e1876816db54c534dd45ca0c0ed6f5b817"

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
//   // console.log(event.type);
//   let paymentIntent;
//   // Handle the event
//   paymentIntent = event.data.object;
//   let userCart;
//   let userId;
//   switch (event.type) {
//     case 'customer.subscription.deleted':
//       console.log(event.data.object)
//       console.log("subscription deleted")

//     case 'charge.succeeded':
//       console.log(event.data.object);
//       console.log("charge succeeded")
//     case 'customer.subscription.created':
//       console.log(event.data.object)

//       console.log("subscription created");
//     case 'payment_intent.created':
//       console.log("Payment Intent created")
//       paymentIntent = event.data.object;
//       // console.log(paymentIntent);
//       if (paymentIntent.object === "subscription") {
//         console.log("**************************************")
//       } else {
//         userId = paymentIntent.metadata.user_id;
//         console.log("Customer ID:--------> ", paymentIntent.metadata);
//         // const cards = await paymentService.listAvailableCards(order.userId.customerId)
//         if (paymentIntent.status === 'requires_payment_method') {
//           try {
//             // Attach a payment method to the PaymentIntent
//             await stripe.paymentIntents.confirm(paymentIntent.id, {
//               payment_method: paymentIntent.metadata.payment_method // Replace with an actual payment method ID
//             });

//             console.log('PaymentIntent confirmed with payment method');
//           } catch (error) {
//             console.error('Error confirming PaymentIntent:', error.message);
//           }
//         }
//       }

//       break;

//     case 'payment_intent.succeeded':
//       console.log("Payment Intent succeeded")
//       console.log(event.data.object);
//       // console.log(event.data.object.object)
//       if (event.data.object.object === 'subscription') {
//         console.log("****-------------******")
//       } else {
//         userId = event.data.object.metadata.user_id;
//         // console.log(order);
//         console.log("User id: -----> ", userId)
//         userCart = await cartService.fetchSongsFromCart(userId)
//         for (let item of userCart) {
//           console.log(item);
//           const transferForCreator = await stripe.transfers.create({
//             amount: item.license.price * 100,
//             currency: 'usd',
//             destination: item.songId.creator.accountId,
//             transfer_group: 'ORDER10',
//             metadata: {
//               user_id: userId
//             }
//           })
//         }

//         let songsInCart = [];
//         let totalPrice = 0;

//         console.log(userCart)
//         for (let item of userCart) {
//           totalPrice += item.license.price;
//           songsInCart.push({
//             songId: item.songId._id,
//             license: item.license
//           });
//         }
//         const uniqueSongIds = [...new Set(songsInCart.map(obj => obj.songId))];
//         for (let uniqueSongId of uniqueSongIds) {
//           const song = await Song.findById(uniqueSongId);
//           song.salesCount += 1;
//           await song.save();
//         }
//         // clear out cart
//         await Cart.deleteMany({ userId: userId });
//         await Order.create({
//           userId,
//           paymentIntentId: event.data.object.id,
//           items: songsInCart,
//           totalPrice: totalPrice
//         })
//         console.log('PaymentIntent was successful!');
//       }

//       break;
//     case 'transfer.created':
//       console.log('transfer created')
//       const transfer = event.data.object;
//       console.log("Transfer:------> ", transfer)
//       break
//     case 'payment.created':
//       console.log("Payment created");
//       break;

//     case 'payment_intent.failed':
//       // Payment failed logic here
//       console.log('PaymentIntent failed!');
//       break;
//     // Add other event types as needed

//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// });


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);
// home route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'API is running!!🚀 move to /v1',
    deployTime: time,
    env: process.env.NODE_ENV
  })
})

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
