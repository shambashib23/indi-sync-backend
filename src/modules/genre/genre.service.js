const Genre = require("./genre.model")

const addGenre = async (createBody) => {
  const genre = await Genre.create(createBody);
  return genre;
}

const getAllGenre = async () => {
  const genre = await Genre.find()
  return genre;
}

module.exports = {
  addGenre,
  getAllGenre
}