const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { uploadFileTos3 } = require('./fileUpload.service');
const ApiSuccess = require('../../utils/ApiSuccess');



const uploadFile = catchAsync(async (req, res) => {
  const getFileUploadUrl = await uploadFileTos3(req);
  new ApiSuccess(res, httpStatus.OK, 'File Uploaded Successfully!', getFileUploadUrl);
});

module.exports = {
  uploadFile,
};



