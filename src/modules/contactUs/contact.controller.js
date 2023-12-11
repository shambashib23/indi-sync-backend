const httpStatus = require("http-status");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");
const contactService = require('./contact.service');
const ApiError = require("../../utils/ApiError");
const { responseMessage } = require("../../utils/common");



const createContactUs = catchAsync(async (req, res) => {
  const contactus = await contactService.addContactUs(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, responseMessage.CONTACT_SUCCESS, contactus);
});

const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.getAllContacts();
  return new ApiSuccess(res, httpStatus.OK, "Contact us fetched successfully", contacts);
})

module.exports = {
  createContactUs,
  getAllContacts
}
