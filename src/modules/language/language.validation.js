const Joi = require('joi');

const addLanguage = {
  body: Joi.object().keys({
    title: Joi.string().required(),
  }),
};

module.exports = {
  addLanguage
}