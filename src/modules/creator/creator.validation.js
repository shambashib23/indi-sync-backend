const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');

// const getProfileById = {
//   params: Joi.object().keys({
//     creatorId: Joi.string().required().custom(objectId),
//   }),
// };

const editCreatorName = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
  })
}

const editCreatorGeneral = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    phone: Joi.string().pattern(/^\+?[0-9]{1,4}[0-9]{6,14}$/),
  })
}

const editCreatorPassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password)
  })
}

module.exports = {
  // getProfileById,
  editCreatorName,
  editCreatorGeneral,
  editCreatorPassword
}
