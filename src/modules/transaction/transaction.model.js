const mongoose = require('mongoose');
const { toJSON } = require('../../plugins');

const transactionSchema = mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      default: ""
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    orderId: {
      type: String,
      default: ""
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
