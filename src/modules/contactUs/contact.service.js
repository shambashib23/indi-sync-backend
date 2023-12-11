const Contact = require("./contact.model");

const addContactUs = async (createBody) => {
  const genre = await Contact.create(createBody);
  return genre;
};

const getAllContacts = async () => {
  const genre = await Contact.find()
  return genre;
}


module.exports = {
  getAllContacts,
  addContactUs
}


