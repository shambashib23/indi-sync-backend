const Language = require("./language.model")

const addLanguage = async (createBody) => {
  const language = await Language.create(createBody)
  return language;
}

const getAllLanguages = async () => {
  const languages = await Language.find();
  return languages;
}

module.exports = {
  addLanguage,
  getAllLanguages
}