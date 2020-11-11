const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
  let data = 'testing xD';
  fs.writeFile('test.txt', data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('written file successfuly');
    }
  });
  console.log('Poga champu?');
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(`I received your POST request. This is what you sent me: ${req.body.post}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
