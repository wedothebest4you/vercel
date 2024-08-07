const express = require('express');
const app = express();

app.use(express.static('./'));

app.listen(2000, () => {
  console.log(`L@2000`);
});
