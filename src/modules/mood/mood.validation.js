const Joi = require('joi');

const addMood = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    imageUrl: Joi.string()
  }),
};

module.exports = {
  addMood
}