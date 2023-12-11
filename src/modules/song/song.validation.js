const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const uploadSong = {
  body: Joi.object().keys({
    uploadUrl: Joi.string().required(),
    coverImage: Joi.string().required(),
    trackName: Joi.string().required(),
    temp: Joi.number().required(),
    genre: Joi.string().required().custom(objectId),
    moods: Joi.array().items(Joi.string().custom(objectId)),
    tags: Joi.array().items(Joi.string()),
    description: Joi.string().required(),
    copyrightHolder: Joi.string().required(),
    releaseDate: Joi.string().required(),
    songLanguage: Joi.string().required(),
    isFreeDownload: Joi.boolean().required(),
    basicPlan: Joi.object({
      price: Joi.number().required(),
      isChecked: Joi.boolean().required(),
    }).required(),
    premiumPlan: Joi.object({
      price: Joi.number().required(),
      isChecked: Joi.boolean().required(),
    }).required(),
    unlimitedPlan: Joi.object({
      price: Joi.number().required(),
      isChecked: Joi.boolean().required(),
    }).required(),
    exclusivePlan: Joi.object({
      price: Joi.number().required(),
      isChecked: Joi.boolean().required(),
    }).required(),
  }),
};

// const editSong = {
//   body: Joi.object().keys({
//     uploadUrl: Joi.string(),
//     coverImage: Joi.string(),
//     trackName: Joi.string(),
//     temp: Joi.number(),
//     genre: Joi.string().custom(objectId),
//     moods: Joi.array().items(Joi.string().custom(objectId)),
//     tags: Joi.array().items(Joi.string()),
//     description: Joi.string(),
//     copyrightHolder: Joi.string(),
//     releaseDate: Joi.string(),
//     songLanguage: Joi.string(),
//     isFreeDownload: Joi.boolean(),
//     basicPlan: Joi.object({
//       price: Joi.number().required(),
//       isChecked: Joi.boolean().required(),
//     }),
//     premiumPlan: Joi.object({
//       price: Joi.number().required(),
//       isChecked: Joi.boolean().required(),
//     }),
//     unlimitedPlan: Joi.object({
//       price: Joi.number().required(),
//       isChecked: Joi.boolean().required(),
//     }),
//     exclusivePlan: Joi.object({
//       price: Joi.number().required,
//       isChecked: Joi.boolean().required(),
//     }),
//   }),
//   params: Joi.object().keys({
//     songId: Joi.string().required().custom(objectId),
//   }),
// }

module.exports = {
  uploadSong,
  // editSong
}