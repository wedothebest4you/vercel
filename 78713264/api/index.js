const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/cookie', (req, res, next) => {
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
