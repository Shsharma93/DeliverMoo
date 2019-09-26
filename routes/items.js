const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const { validatePostItem } = require('../validateInput');
const auth = require('../auth');
const _ = require('lodash');

router.get('/', async (req, res) => {
  try {
    const items = await Items.find();
    res.json({ success: true, items });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: 'Item could not be found' });
  }
});

router.post('/', auth, async (req, res) => {
  const { error } = validatePostItem(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  try {
    const allItems = [];
    for (let i in req.body.items) {
      const item = await Items.findOne(
        _.pick(req.body.items[i], ['type', 'color', 'size'])
      );

      if (item) {
        item.stock += req.body.items[i].stock;
        await item.save();
        allItems.push(item._id);
      } else {
        const newItem = new Items({ ...req.body.items[i] });
        await newItem.save();
        allItems.push(newItem._id);
      }
    }
    res.json({ success: true, itemIds: allItems });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: 'One (or more) items are invalid' });
  }
});

module.exports = router;
