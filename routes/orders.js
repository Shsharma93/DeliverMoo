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
    const order = await Orders.find();
    res.send(order);
  } catch (error) {
    res.status(404).send('Order could not be found');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Orders.findById({ _id: req.params.id });
    res.send(order);
  } catch (error) {
    res.status(404).send('Order could not be found');
  }
});

router.post('/', async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).send('Invalid request');
  }

  if (req.body.itemId.length !== req.body.quantity.length)
    return res.status(400).send('Invalid request');

  let item = [];

  for (let i = 0; i < req.body.itemId.length; i++) {
    let item;
    try {
      item = await Items.findById(req.body.itemId[i]);
    } catch (error) {
      return res.status(404).send('Item could not be found');
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
        return res.status(400).send('Item does not have enough stock');
      task.update(
        'items',
        { _id: item[i]._id },
        { $inc: { stock: -+req.body.quantity[i] } }
      );
    }
    task.run();
  } catch (error) {
    res.status(500).send('Something failed');
  }

  res.send(order);
});

module.exports = router;
