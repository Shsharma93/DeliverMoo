const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const { validatePostItem } = require('../validateInput');
const auth = require('../auth');
const _ = require('lodash');

router.get('/', async (req, res) => {
  try {
    const item = await Items.find();
    res.send(item);
  } catch (error) {
    res.status(404).send('0 items available in the database');
  }
});

router.post('/', auth, async (req, res) => {
  const { error } = validatePostItem(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const item = await Items.findOne(
      _.pick(req.body, ['type', 'color', 'size'])
    );

    if (item) {
      item.stock += req.body.stock;
      await item.save();
      return res.send(item);
    }

    const newItem = new Items({ ...req.body });
    await newItem.save();
    res.send(newItem._id);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

module.exports = router;
