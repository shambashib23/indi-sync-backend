const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    paymentIntentId: {
      type: String,
      default: ""
    },
    transactionId: {
      type: String,
      default: ""
    },
    items: [
      {
        songId: mongoose.Schema.Types.ObjectId,
        license: {
          _id: mongoose.Schema.Types.ObjectId,
          licenseType: String,
          price: Number
        }
      }
    ],
    totalPrice: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);
orderSchema.plugin(mongoosePaginate)

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
