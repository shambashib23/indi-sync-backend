const Joi = require('joi');
const { password } = require('../../validations/custom.validation');

const addGenre = {
  body: Joi.object().keys({
    title: Joi.string().required(),
  }),
};

module.exports = {
  addGenre
}