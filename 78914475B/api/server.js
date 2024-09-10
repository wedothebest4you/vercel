const express = require('express');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    sameSite: 'none',
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 600000 },
  })
);

app.use(
  cors({
    origin: ['https://78914475-f.vercel.app'],
    methods: ['POST', 'GET'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  })
);

app.get('/', async (req, res) => {
  res
    .cookie('someCookie', 'Get-Somevalue', { secure: true, sameSite: 'None' })
    .send('accessed by get');
});

app.post('/', async (req, res) => {
  req.session.id = 1;
  res
    .cookie('someCookie', 'POST-Somevalue', {
      secure: true,
      sameSite: 'None',
    })
    .send('accessed by post');
});

app.listen(3000, () => {
  console.log('L@3000');
});

<!DOCTYPE html><html lang="en"><head><link href="/vendor/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"><script src="/vendor/bootstrap/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script></head><body><div id="vidguts"><div class="container-fluid"><div class="card mt-2"><div class="card-header"><h5>Video</h5></div><div class="card-body"><div class="row"><div class="col"><video controls="" width="100%" height="100%" autoplay=""><source src="beach0.mp4" type="video/mp4"></video></div></div></div></div></div></div></body></html>

