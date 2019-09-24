const auth = (req, res, next) => {
  if (!req.headers['authorization'])
    return res.status(400).send('Unauthorized');

  let token = req.headers['authorization'];
  token = token.split(' ')[1];

  if (token === process.env.AUTH_TOKEN) {
    next();
  } else {
    return res.status(400).send('Unauthorized');
  }
};

module.exports = auth;
