const genreController = require('./genre.controller')
const genreService = require('./genre.service')
const genreValidation = require('./genre.validation')
const Genre = require('./genre.model')

module.exports = {
  genreController,
  genreService,
  genreValidation,
  Genre
}