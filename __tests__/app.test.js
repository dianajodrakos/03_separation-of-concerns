const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('controller routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('posts a new order in our database and sends a text message', async () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('gets all orders in our database', async () => {
    const order = await Order.insert({ quantity: 10 });

    return request(app)
    .get('/api/v1/orders')
    .then((res) => {
      expect(res.body).toEqual([order]);
    });
  });

  it('gets an order by id', async () => {
    const order = await Order.insert({ quantity: 10 });

    return request(app)
      .get(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).toEqual(order);
      });
  });

  it('updates an order by id', async () => {
    const order = await Order.insert({ quantity: 10 });
    const updatedOrder = { 
      id: order.id,
      quantity: 5 };

    return request(app)
      .put(`/api/v1/orders/${order.id}`)
      .send({ quantity: 5 })
      .then((res) => {
        expect(res.body).toEqual(updatedOrder);
      });
  });

  it('deletes an order by id', async () => {
    const order = await Order.insert({ quantity: 10 })

    return request(app)
      .delete(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).not.toEqual(order);
      });
  });
  
});
