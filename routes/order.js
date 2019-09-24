const express = require('express');
const router = express.Router();
const Orders = require('../models/orders');

router.get('/:id', async (req, res) => {
  try {
    const order = await Orders.findById({ _id: req.params.id });
    res.send(order);
  } catch (error) {
    res.status(404).send('Order could not be found');
  }
});

module.exports = router;
