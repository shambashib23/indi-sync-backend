const Order = require("./order.model")

const createOrder = async (userId, transactionId, songIds, totalPrice) => {
  let order;
  order = await Order.findOne({
    $and: [
      userId,
      transactionId
    ]
  })
  if (order) {
    for (let songId of songIds) {
      order.items.push(songId);
    }
    await order.save();
  } else {
    order = await Order.create({
      userId,
      transactionId,
      songIds,
      totalPrice
    })
  }
  return order;
};

const fetchOrders = async (userId) => {
  const order = await Order.find({
    userId
  });
  return order;
}



module.exports = {
  createOrder,
  fetchOrders
}
