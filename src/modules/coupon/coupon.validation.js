const Joi = require('joi');

const createCoupon = {
  body: Joi.object().keys({
    discountAmount: Joi.number().required(),
  }),
};


module.exports = {
  createCoupon
}
