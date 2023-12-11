const httpStatus = require("http-status");
const transactionService = require("./transaction.service");
const ApiSuccess = require("../../utils/ApiSuccess");
const catchAsync = require("../../utils/catchAsync");


const fetchAllTransactions = catchAsync(async(req, res) => {
  const transactions = await transactionService.fetchTransactionList();
  return new ApiSuccess(res, httpStatus.OK, 'Transactions fetched successfully for admin', transactions);
});



module.exports = {
  fetchAllTransactions
}
