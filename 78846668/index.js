const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('done with Vercel');
});

app.listen(3000, () => console.log('L@3000'));

module.exports = app;
