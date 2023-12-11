const mongoose = require('mongoose');

const pricingPlanSchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    price: {
      type: Number,
      default: 0
    },
    priceId: {
      type: String,
      default: ""
    },
    productId: {
      type: String,
      default: ""
    },
    interval: {
      type: String,
      enum: ['year', 'month']
    },
    description: {
      type: String
    },
    uploadLimit: {
      type: Number
    },
    allowCustomStoreFront: {
      type: Boolean,
      default: false
    },
    allowOffersAndDiscounts: {
      type: Boolean,
      default: false
    },
    allowEmbedStore: {
      type: Boolean,
      default: false
    },
    allowFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);

module.exports = PricingPlan;
