const Joi = require('joi');


const addContactUsMessage = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    message: Joi.string().required()
  }),
};

module.exports = {
  addContactUsMessage
}
