const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('done');
});

app.listen(4000, () => {
  console.log(`L@4000`);
});

module.exports = app;
