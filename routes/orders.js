const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Orders = require('../models/orders');
const Items = require('../models/items');
const Fawn = require('fawn');
const { validateOrder } = require('../validateInput');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json({ success: true, orders });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: 'Item could not be found' });
  }
});

router.post('/', async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  if (req.body.itemId.length !== req.body.quantity.length)
    return res.status(400).json({ success: false, message: 'Invalid request' });

  let item = [];

  for (let i = 0; i < req.body.itemId.length; i++) {
    let item;
    try {
      item = await Items.findById(req.body.itemId[i]);
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, message: 'Item could not be found' });
    }
    item.push(item);
  }

  const order = new Orders({
    ...req.body
  });

  try {
    let task = new Fawn.Task();
    task = task.save('orders', order);
    for (let i in item) {
      if (item[i].stock < +req.body.quantity[i])
        return res
          .status(400)
          .json({ success: false, message: 'Item does not have enough stock' });
      task.update(
        'items',
        { _id: item[i]._id },
        { $inc: { stock: -+req.body.quantity[i] } }
      );
    }
    task.run();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Order could not be completed' });
  }

  res.json({ success: true, order });
});

module.exports = router;
