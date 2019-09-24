const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const { validatePutItem } = require('../validateInput');
const auth = require('../auth');

router.get('/:id', async (req, res) => {
  try {
    const item = await Items.findById({ _id: req.params.id });
    res.send(item);
  } catch (error) {
    res.status(404).send('Item could not be found');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validatePutItem(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await Items.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body
      }
    });
    res.send('true');
  } catch (error) {
    return res.status(404).send('Item could not be found');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Items.findByIdAndRemove({ _id: req.params.id });
    res.send('true');
  } catch (error) {
    res.status(400).send('Item could not be found');
  }
});

module.exports = router;
