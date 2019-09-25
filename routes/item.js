const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const { validatePutItem } = require('../validateInput');
const auth = require('../auth');

router.get('/:id', async (req, res) => {
  try {
    const item = await Items.findById({ _id: req.params.id });
    res.json({ success: true, item });
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: 'Item could not be found' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validatePutItem(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  try {
    await Items.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body
      }
    });
    res.json({ success: true });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: 'Item could not be found' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Items.findByIdAndRemove({ _id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: 'Item could not be found' });
  }
});

module.exports = router;
