const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../plugins');

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String
    },
    discountAmount: {
      type: Number
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    validTill: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// add plugin that converts mongoose to json
// couponSchema.plugin(toJSON);


const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
