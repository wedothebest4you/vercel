const express = require('express');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: ['https://78914475-f.vercel.app'],
    methods: ['POST', 'GET'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  })
);

app.get('/', async (req, res) => {
  res.send('accessed by get');
});

app.post('/', async (req, res) => {
  res.send('accessed by post');
});

app.listen(3000, () => {
  console.log('L@3000');
});
