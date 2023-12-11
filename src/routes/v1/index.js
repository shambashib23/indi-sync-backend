const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const creatorRoute = require('./creator.route');
const adminRoute = require('./admin.route');
const songRoute = require('./song.route');
const genreRoute = require('./genre.route');
const languageRoute = require('./language.route');
const moodRoute = require('./mood.route');
const pricingPlanRoute = require('./pricingPlan.route');
const contactUsRoute = require('./contactus.route');
const newsLetterRoute = require('./newsletter.route');
const fileUploadRoute = require('./fileUpload.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/creator',
    route: creatorRoute
  },
  {
    path: '/admin',
    route: adminRoute
  },
  {
    path: '/songs',
    route: songRoute
  },
  {
    path: '/genre',
    route: genreRoute
  },
  {
    path: '/contact',
    route: contactUsRoute
  },
  {
    path: '/languages',
    route: languageRoute
  },
  {
    path: '/moods',
    route: moodRoute
  },
  {
    path: '/pricingPlans',
    route: pricingPlanRoute
  },
  {
    path: '/newsletter',
    route: newsLetterRoute
  },
  {
    path: '/fileupload',
    route: fileUploadRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
