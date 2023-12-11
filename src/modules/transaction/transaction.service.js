const Transaction = require('./transaction.model');

const fetchTransactionList = async () => {
  const transactions = await Transaction.find().populate(['user']).sort({
    createdAt: -1
  });
  return transactions;
};


module.exports = {
  fetchTransactionList
}

