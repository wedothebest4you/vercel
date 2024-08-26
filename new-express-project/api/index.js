const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:2000',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  console.log(
    `Access-Control-Allow-Origin : ${res.getHeader(
      'Access-Control-Allow-Origin'
    )}`
  );
  res.send('done');
});

app.listen(4000, () => {
  console.log(`L@4000`);
});

module.exports = app;
