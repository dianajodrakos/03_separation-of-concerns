const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async createOrder(value) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${value.quantity}`
    );

    const order = await Order.insert(value);

    return order;
  }

  static async updateOrder(req) {
    const id = req.params.id;
    const quantity = req.body.quantity;

    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order updated for ${quantity}`
    );

    const order = await Order.putById(id, quantity);

    return order;
  }

  static async deleteOrder(req) {
    const id = req.params.id;

    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order ${id} has been deleted`
    );

    const order = await Order.deleteById(id);

    return order;

  }

};
