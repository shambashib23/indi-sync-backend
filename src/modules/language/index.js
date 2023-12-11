const languageController = require('./language.controller')
const languageService = require('./language.service')
const languageValidation = require('./language.validation')
const Language = require('./language.model')

module.exports = {
  languageController,
  languageService,
  languageValidation,
  Language
}