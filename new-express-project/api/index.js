const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('public'));

app.use(cookieParser());

app.get('/cookie', (req, res) => {
  let response;

  if (req.cookies?.somecookie) {
    response = 'Same cookie: A cookie received and the same sent to client';
  } else {
    res.cookie('somecookie', 'cookie text');
    response = 'New cookie: A new cookie created and sent to the client';
  }

  res.send(response);
});

app.listen(4000, () => {
  console.log(`L@4000`);
});

module.exports = app;
