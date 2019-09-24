const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to Database'))
  .catch(err => console.log('Could not connect to Database', err));

app.use('/item', require('./routes/item'));
app.use('/items', require('./routes/items'));
app.use('/order', require('./routes/order'));
app.use('/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
